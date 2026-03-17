package com.wipro.order_service.entity;
 
import jakarta.persistence.*;
 
@Entity
@Table(name = "order_items")
public class OrderItem {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private Long orderId;
 
    // menuItemId links back to menu-service for stock reduction
    private Long menuItemId;
 
    private String itemName;
 
    private int quantity;
 
    // Price per unit at time of order (snapshot — price may change later)
    private double price;
 
    public OrderItem() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
 
    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }
 
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
 
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
 
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
