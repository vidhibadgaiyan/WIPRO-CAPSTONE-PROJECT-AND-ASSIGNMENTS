package com.wipro.order_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wipro.order_service.dto.BillResponse;
import com.wipro.order_service.dto.NotificationDTO;
import com.wipro.order_service.dto.OrderRequest;
import com.wipro.order_service.entity.Order;
import com.wipro.order_service.entity.OrderItem;
import com.wipro.order_service.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    // User: place order
    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(service.placeOrder(request));
    }

    // Admin: get all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    // User: get their own orders by email
    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(@RequestParam String email) {
        return ResponseEntity.ok(service.getOrdersByEmail(email));
    }

    // Get items for a specific order
    @GetMapping("/{id}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable Long id) {
        return ResponseEntity.ok(service.getItemsByOrderId(id));
    }

    // Admin: get all orders as notification cards
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDTO>> getNotifications() {
        return ResponseEntity.ok(service.getAdminNotifications());
    }

    // Admin: update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestParam String status) {
        return ResponseEntity.ok(service.updateOrderStatus(id, status));
    }

    // Admin: generate bill — returns full BillResponse
    @PutMapping("/{id}/generateBill")
    public ResponseEntity<BillResponse> generateBill(@PathVariable Long id) {
        return ResponseEntity.ok(service.generateBill(id));
    }

    // User: get bill to show in new tab — only if billGenerated = true
    @GetMapping("/{id}/bill")
    public ResponseEntity<BillResponse> getBill(@PathVariable Long id) {
        return ResponseEntity.ok(service.getBill(id));
    }

    // User: cancel order — only allowed when status is PENDING
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancelOrder(id));
    }

    // Admin: total revenue from DELIVERED orders
    @GetMapping("/revenue")
    public ResponseEntity<Double> revenue() {
        return ResponseEntity.ok(service.getRevenue());
    }
}
