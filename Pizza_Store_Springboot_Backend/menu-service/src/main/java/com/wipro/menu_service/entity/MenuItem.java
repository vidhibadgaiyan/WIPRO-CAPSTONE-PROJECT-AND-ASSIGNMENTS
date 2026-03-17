package com.wipro.menu_service.entity;
 
import jakarta.persistence.*;
 
@Entity
@Table(name = "menu_items")
public class MenuItem {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private String name;
 
    @Column(length = 500)
    private String description;
 
    private double price;
 
    // category: "Pizza", "Appetizers", "Beverages"
    private String category;
 
    // subcategory: "Veg", "NonVeg" — used only under Pizza
    private String subcategory;
 
    private boolean available;
 
    // Stock quantity stored in DB; only decremented when order is DELIVERED
    private int quantity;
 
    private String image;
 
    public MenuItem() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
 
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
 
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
 
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
 
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
 
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
 
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
 
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
