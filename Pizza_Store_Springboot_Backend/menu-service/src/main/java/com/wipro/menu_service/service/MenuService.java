package com.wipro.menu_service.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.wipro.menu_service.dto.MenuDTO;
import com.wipro.menu_service.entity.MenuItem;
import com.wipro.menu_service.exception.MenuItemNotFoundException;
import com.wipro.menu_service.repository.MenuRepository;

@Service
public class MenuService {

    @Autowired
    private MenuRepository repository;

    private MenuDTO toDTO(MenuItem item) {
        return new MenuDTO(
                item.getId(), item.getName(), item.getDescription(),
                item.getPrice(), item.getCategory(), item.getSubcategory(),
                item.isAvailable(), item.getQuantity(), item.getImage()
        );
    }

    public MenuDTO addMenuItem(MenuItem item) {
        return toDTO(repository.save(item));
    }

    public List<MenuDTO> getAllMenu() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MenuDTO getMenuItemById(Long id) {
        return toDTO(repository.findById(id)
                .orElseThrow(() -> new MenuItemNotFoundException("Item not found: " + id)));
    }

    public MenuDTO updateMenu(Long id, MenuItem updated) {
        MenuItem existing = repository.findById(id)
                .orElseThrow(() -> new MenuItemNotFoundException("Item not found: " + id));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setSubcategory(updated.getSubcategory());
        existing.setAvailable(updated.isAvailable());
        existing.setQuantity(updated.getQuantity());
        existing.setImage(updated.getImage());
        return toDTO(repository.save(existing));
    }

    public void deleteMenu(Long id) {
        if (!repository.existsById(id))
            throw new MenuItemNotFoundException("Item not found: " + id);
        repository.deleteById(id);
    }

    public List<MenuDTO> getByCategory(String category) {
        return repository.findByCategory(category).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MenuDTO> getBySubcategory(String subcategory) {
        return repository.findBySubcategory(subcategory).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MenuDTO> getByCategoryAndSubcategory(String category, String subcategory) {
        return repository.findByCategoryAndSubcategory(category, subcategory)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MenuDTO reduceStock(Long id, int quantity) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new MenuItemNotFoundException("Item not found: " + id));
        int updated = item.getQuantity() - quantity;
        if (updated < 0) throw new RuntimeException("Insufficient stock for: " + item.getName());
        item.setQuantity(updated);
        if (updated == 0) item.setAvailable(false);
        return toDTO(repository.save(item));
    }
}