package com.event.service;

import com.event.entity.Inventory;
import com.event.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository repo;

    public InventoryService(InventoryRepository repo) {
        this.repo = repo;
    }

    public List<Inventory> getAll() {
        return repo.findAll();
    }

    // Purchase create হলে এই method call হবে
    public void addStock(String itemName, String category, Integer quantity) {
        Inventory inventory = repo.findByItemName(itemName)
                .orElse(null);

        if (inventory == null) {
            // নতুন item — নতুন inventory row create
            inventory = new Inventory();
            inventory.setItemName(itemName);
            inventory.setCategory(category);
            inventory.setCurrentQuantity(quantity);
        } else {
            // আগে থেকে আছে — quantity add করো
            inventory.setCurrentQuantity(inventory.getCurrentQuantity() + quantity);
        }

        inventory.setStatus(inventory.getCurrentQuantity() > 0 ? "In Stock" : "Out of Stock");
        repo.save(inventory);
    }

    // Purchase update হলে এই method call হবে
    public void adjustStock(String itemName, Integer oldQuantity, Integer newQuantity) {
        Inventory inventory = repo.findByItemName(itemName)
                .orElseThrow(() -> new RuntimeException("Inventory not found for: " + itemName));

        int difference = newQuantity - oldQuantity;
        int updatedQty = inventory.getCurrentQuantity() + difference;

        if (updatedQty < 0) {
            throw new RuntimeException("Stock cannot go negative for item: " + itemName);
        }

        inventory.setCurrentQuantity(updatedQty);
        inventory.setStatus(updatedQty > 0 ? "In Stock" : "Out of Stock");
        repo.save(inventory);
    }

    // Purchase delete হলে এই method call হবে
    public void reduceStock(String itemName, Integer quantity) {
        Inventory inventory = repo.findByItemName(itemName)
                .orElseThrow(() -> new RuntimeException("Inventory not found for: " + itemName));

        int updatedQty = inventory.getCurrentQuantity() - quantity;

        if (updatedQty < 0) {
            throw new RuntimeException("Cannot delete purchase. Stock would go negative for: " + itemName);
        }

        inventory.setCurrentQuantity(updatedQty);
        inventory.setStatus(updatedQty > 0 ? "In Stock" : "Out of Stock");
        repo.save(inventory);
    }

    // Usage / Sale এ item consume হলে এই method call হবে
    public void consumeStock(String itemName, Integer quantity) {
        Inventory inventory = repo.findByItemName(itemName)
                .orElseThrow(() -> new RuntimeException("Item not found in inventory: " + itemName));

        if (inventory.getCurrentQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for: " + itemName
                    + ". Available: " + inventory.getCurrentQuantity());
        }

        int updatedQty = inventory.getCurrentQuantity() - quantity;
        inventory.setCurrentQuantity(updatedQty);
        inventory.setStatus(updatedQty > 0 ? "In Stock" : "Out of Stock");
        repo.save(inventory);
    }
}