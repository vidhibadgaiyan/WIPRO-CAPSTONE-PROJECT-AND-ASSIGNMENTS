package com.wipro.order_service.dto;
 
import java.time.LocalDateTime;
import java.util.List;
 
/**
 * Notification payload shown to admin in the Orders section.
 * Shows order id, customer email, items summary, total, and delivery mode.
 *
 * Example items summary: ["Margherita x2", "Farmhouse x1"]
 */
public class NotificationDTO {
 
    private Long orderId;
    private String customerEmail;
    private List<String> itemsSummary;   // e.g. ["Margherita x2", "Farmhouse x1"]
    private double total;
    private String deliveryMode;
    private String status;
    private boolean billGenerated;
    private LocalDateTime createdAt;
 
    public NotificationDTO() {}
 
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
 
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
 
    public List<String> getItemsSummary() { return itemsSummary; }
    public void setItemsSummary(List<String> itemsSummary) { this.itemsSummary = itemsSummary; }
 
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
 
    public String getDeliveryMode() { return deliveryMode; }
    public void setDeliveryMode(String deliveryMode) { this.deliveryMode = deliveryMode; }
 
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
 
    public boolean isBillGenerated() { return billGenerated; }
    public void setBillGenerated(boolean billGenerated) { this.billGenerated = billGenerated; }
 
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
