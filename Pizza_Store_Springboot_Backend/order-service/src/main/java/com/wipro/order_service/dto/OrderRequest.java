package com.wipro.order_service.dto;

import java.util.List;

public class OrderRequest {

    private String deliveryMode;
    private String customerEmail;
    private List<OrderItemDTO> items;

    public OrderRequest() {}

    public String getDeliveryMode() { return deliveryMode; }
    public void setDeliveryMode(String deliveryMode) { this.deliveryMode = deliveryMode; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}