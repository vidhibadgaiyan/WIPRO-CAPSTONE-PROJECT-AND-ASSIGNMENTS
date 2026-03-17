package com.wipro.order_service.entity;
 
import jakarta.persistence.*;
import java.time.LocalDateTime;
 
@Entity
@Table(name = "orders")
public class Order {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private double totalPrice;
 
    // Status flow: PENDING → PLACED → PREPARING → OUT_FOR_DELIVERY → DELIVERED / CANCELLED
    private String status;
 
    private String deliveryMode;
 
    private String customerEmail;
 
    // Set to true when admin clicks "Generate Bill"
    private boolean billGenerated;
 
    // Timestamp when order was created — used on the bill page
    private LocalDateTime createdAt;
 
    public Order() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
 
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
 
    public String getDeliveryMode() { return deliveryMode; }
    public void setDeliveryMode(String deliveryMode) { this.deliveryMode = deliveryMode; }
 
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
 
    public boolean isBillGenerated() { return billGenerated; }
    public void setBillGenerated(boolean billGenerated) { this.billGenerated = billGenerated; }
 
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}