package com.wipro.menu_service.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.wipro.menu_service.dto.MenuDTO;
import com.wipro.menu_service.entity.MenuItem;
import com.wipro.menu_service.service.MenuService;

@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private MenuService service;

    @PostMapping
    public ResponseEntity<MenuDTO> addMenu(@RequestBody MenuItem item) {
        return ResponseEntity.ok(service.addMenuItem(item));
    }

    @GetMapping
    public ResponseEntity<List<MenuDTO>> getMenu() {
        return ResponseEntity.ok(service.getAllMenu());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getMenuItemById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuDTO> updateMenu(@PathVariable Long id, @RequestBody MenuItem item) {
        return ResponseEntity.ok(service.updateMenu(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenu(@PathVariable Long id) {
        service.deleteMenu(id);
        return ResponseEntity.ok("Menu item deleted successfully");
    }

    @GetMapping("/filter")
    public ResponseEntity<List<MenuDTO>> filterMenu(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory) {
        if (category != null && subcategory != null) {
            return ResponseEntity.ok(service.getByCategoryAndSubcategory(category, subcategory));
        } else if (category != null) {
            return ResponseEntity.ok(service.getByCategory(category));
        } else if (subcategory != null) {
            return ResponseEntity.ok(service.getBySubcategory(subcategory));
        } else {
            return ResponseEntity.ok(service.getAllMenu());
        }
    }

    @PutMapping("/reduceStock/{id}/{quantity}")
    public ResponseEntity<MenuDTO> reduceStock(@PathVariable Long id, @PathVariable int quantity) {
        return ResponseEntity.ok(service.reduceStock(id, quantity));
    }
}
 