package com.wipro.menu_service.dto;

public class MenuDTO {

    private Long id;
    private String name;
    private String description;
    private double price;
    private String category;
    private String subcategory;
    private boolean available;
    private int quantity;
    private String image;

    public MenuDTO() {}

    public MenuDTO(Long id, String name, String description, double price,
                   String category, String subcategory, boolean available,
                   int quantity, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.subcategory = subcategory;
        this.available = available;
        this.quantity = quantity;
        this.image = image;
    }

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