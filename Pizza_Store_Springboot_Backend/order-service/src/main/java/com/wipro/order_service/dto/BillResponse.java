package com.wipro.order_service.dto;
 
import java.time.LocalDateTime;
import java.util.List;
 
/**
 * Full bill details sent to frontend when user clicks "Show Bill".
 * This opens in a new browser tab.
 */
public class BillResponse {
 
    private Long orderId;
    private String customerEmail;
    private String deliveryMode;
    private String status;
    private LocalDateTime createdAt;
    private List<BillItem> items;
    private double totalPrice;
 
    public BillResponse() {}
 
    // ── Nested class for each line item on the bill ──────────────────────────
    public static class BillItem {
 
        private String itemName;
        private int quantity;
        private double unitPrice;
        private double subtotal;
 
        public BillItem() {}
 
        public BillItem(String itemName, int quantity, double unitPrice) {
            this.itemName = itemName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.subtotal = unitPrice * quantity;
        }
 
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
 
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
 
        public double getUnitPrice() { return unitPrice; }
        public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
 
        public double getSubtotal() { return subtotal; }
        public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    }
 
    // ── Getters / Setters ────────────────────────────────────────────────────
 
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
 
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
 
    public String getDeliveryMode() { return deliveryMode; }
    public void setDeliveryMode(String deliveryMode) { this.deliveryMode = deliveryMode; }
 
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
 
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
 
    public List<BillItem> getItems() { return items; }
    public void setItems(List<BillItem> items) { this.items = items; }
 
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}
