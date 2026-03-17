package com.wipro.order_service.repository;
 
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.wipro.order_service.entity.Order;
 
public interface OrderRepository extends JpaRepository<Order, Long> {
 
    // Used by user to fetch only their own orders
    List<Order> findByCustomerEmail(String customerEmail);
 
    // Used by admin revenue calculation — only DELIVERED orders count
    List<Order> findByStatus(String status);
}
 