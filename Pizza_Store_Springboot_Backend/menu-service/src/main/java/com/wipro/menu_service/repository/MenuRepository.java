package com.wipro.menu_service.repository;
 
import java.util.List;
import java.util.Optional;
 
import org.springframework.data.jpa.repository.JpaRepository;
import com.wipro.menu_service.entity.MenuItem;
 
public interface MenuRepository extends JpaRepository<MenuItem, Long> {
 
    // Filter by top-level category (Pizza, Appetizers, Beverages)
    List<MenuItem> findByCategory(String category);
 
    // Filter by subcategory (Veg, NonVeg) — used under Pizza
    List<MenuItem> findBySubcategory(String subcategory);
 
    // Filter by both category + subcategory (e.g. Pizza + Veg)
    List<MenuItem> findByCategoryAndSubcategory(String category, String subcategory);
 
    // Used by order-service stock reduction endpoint
    Optional<MenuItem> findById(Long id);
}