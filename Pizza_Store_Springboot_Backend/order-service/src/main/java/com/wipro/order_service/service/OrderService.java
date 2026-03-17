package com.wipro.order_service.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.wipro.order_service.dto.BillResponse;
import com.wipro.order_service.dto.NotificationDTO;
import com.wipro.order_service.dto.OrderItemDTO;
import com.wipro.order_service.dto.OrderRequest;
import com.wipro.order_service.entity.Order;
import com.wipro.order_service.entity.OrderItem;
import com.wipro.order_service.exception.OrderNotFoundException;
import com.wipro.order_service.repository.OrderItemRepository;
import com.wipro.order_service.repository.OrderRepository;
import com.wipro.order_service.security.JwtUtil;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository itemRepo;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    // Place Order
    public Order placeOrder(OrderRequest request) {

        Order order = new Order();
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryMode(request.getDeliveryMode());
        order.setStatus("PENDING");
        order.setBillGenerated(false);
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepo.save(order);

        double total = 0;

        for (OrderItemDTO dto : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrderId(savedOrder.getId());
            item.setMenuItemId(dto.getMenuItemId());
            item.setItemName(dto.getItemName());
            item.setQuantity(dto.getQuantity());
            item.setPrice(dto.getPrice());
            total += dto.getPrice() * dto.getQuantity();
            itemRepo.save(item);
        }

        savedOrder.setTotalPrice(total);
        return orderRepo.save(savedOrder);
    }

    // Get All Orders (Admin)
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    // Get Orders by Customer Email (User)
    public List<Order> getOrdersByEmail(String email) {
        return orderRepo.findByCustomerEmail(email);
    }

    // Get Order Items for an Order
    public List<OrderItem> getItemsByOrderId(Long orderId) {
        return itemRepo.findByOrderId(orderId);
    }

    // Admin: Get Notifications
    public List<NotificationDTO> getAdminNotifications() {

        List<Order> orders = orderRepo.findAll();
        List<NotificationDTO> notifications = new ArrayList<>();

        for (Order order : orders) {
            List<OrderItem> items = itemRepo.findByOrderId(order.getId());

            List<String> summary = new ArrayList<>();
            for (OrderItem item : items) {
                summary.add(item.getItemName() + " x" + item.getQuantity());
            }

            NotificationDTO dto = new NotificationDTO();
            dto.setOrderId(order.getId());
            dto.setCustomerEmail(order.getCustomerEmail());
            dto.setItemsSummary(summary);
            dto.setTotal(order.getTotalPrice());
            dto.setDeliveryMode(order.getDeliveryMode());
            dto.setStatus(order.getStatus());
            dto.setBillGenerated(order.isBillGenerated());
            dto.setCreatedAt(order.getCreatedAt());

            notifications.add(dto);
        }

        return notifications;
    }

    // Admin: Update Order Status
    // When DELIVERED — calls menu-service to reduce stock
    // Uses localhost:8083 directly with an internal admin token
    public Order updateOrderStatus(Long id, String status) {

        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));

        order.setStatus(status);

        if ("DELIVERED".equals(status)) {

            List<OrderItem> items = itemRepo.findByOrderId(id);

            // Generate an internal admin token to authenticate with menu-service
            String internalToken = jwtUtil.generateInternalAdminToken();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + internalToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            for (OrderItem item : items) {
                try {
                    String url = "http://localhost:8083/menu/reduceStock/"
                            + item.getMenuItemId() + "/"
                            + item.getQuantity();

                    restTemplate.exchange(url, HttpMethod.PUT, entity, Void.class);

                } catch (Exception e) {
                    System.err.println("Stock reduction failed for menuItemId: "
                            + item.getMenuItemId() + " — " + e.getMessage());
                }
            }
        }

        return orderRepo.save(order);
    }

    // Admin: Generate Bill
    public BillResponse generateBill(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        order.setBillGenerated(true);
        orderRepo.save(order);

        return buildBillResponse(order);
    }

    // User: Get Bill
    public BillResponse getBill(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        if (!order.isBillGenerated()) {
            throw new RuntimeException("Bill has not been generated yet by the admin");
        }

        return buildBillResponse(order);
    }

    // User: Cancel Order — only when PENDING
    public Order cancelOrder(Long id) {

        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException(
                    "Order cannot be cancelled. Current status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        return orderRepo.save(order);
    }

    // Admin: Revenue
    public double getRevenue() {

        List<Order> delivered = orderRepo.findByStatus("DELIVERED");

        double revenue = 0;
        for (Order order : delivered) {
            revenue += order.getTotalPrice();
        }
        return revenue;
    }

    // Private Helper
    private BillResponse buildBillResponse(Order order) {

        List<OrderItem> items = itemRepo.findByOrderId(order.getId());

        List<BillResponse.BillItem> billItems = new ArrayList<>();
        for (OrderItem item : items) {
            billItems.add(new BillResponse.BillItem(
                    item.getItemName(),
                    item.getQuantity(),
                    item.getPrice()
            ));
        }

        BillResponse bill = new BillResponse();
        bill.setOrderId(order.getId());
        bill.setCustomerEmail(order.getCustomerEmail());
        bill.setDeliveryMode(order.getDeliveryMode());
        bill.setStatus(order.getStatus());
        bill.setCreatedAt(order.getCreatedAt());
        bill.setItems(billItems);
        bill.setTotalPrice(order.getTotalPrice());

        return bill;
    }
}
 

