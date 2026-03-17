package com.wipro.order_service.dto;
 
/**
 * Represents a single cart line item sent from the frontend when placing an order.
 * Using a DTO here keeps the entity clean and avoids exposing orderId prematurely.
 */
public class OrderItemDTO {
 
    private Long menuItemId;   // id from menu-service
    private String itemName;   // display name (snapshot)
    private int quantity;
    private double price;      // unit price at time of order (snapshot)
 
    public OrderItemDTO() {}
 
    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }
 
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
 
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
 
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
