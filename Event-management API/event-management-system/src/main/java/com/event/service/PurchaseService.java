package com.event.service;

import com.event.entity.Purchase;
import com.event.entity.Supplier;
import com.event.repository.InventoryRepository;
import com.event.repository.PurchaseRepository;
import com.event.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository repo;
    private final SupplierRepository supplierRepo;
    private final InventoryService inventoryService;
    private final InventoryRepository inventoryRepo;

    public PurchaseService(PurchaseRepository repo,
                           SupplierRepository supplierRepo,
                           InventoryService inventoryService,
                           InventoryRepository inventoryRepo) {
        this.repo = repo;
        this.supplierRepo = supplierRepo;
        this.inventoryService = inventoryService;
        this.inventoryRepo = inventoryRepo;
    }
    public List<Purchase> getAll() {
        return repo.findAll();
    }

    public Purchase getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found: " + id));
    }

    public List<Purchase> getBySupplierId(Long supplierId) {
        return repo.findBySupplierId(supplierId);
    }

    @Transactional
    public Purchase save(Long supplierId, Purchase purchase) {
        Supplier supplier = supplierRepo.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + supplierId));

        purchase.setSupplier(supplier);

        if (purchase.getQuantity() != null && purchase.getUnitPrice() != null) {
            purchase.setTotalAmount(purchase.getQuantity() * purchase.getUnitPrice());
        }

        purchase.setPaymentStatus("Paid");

        Purchase saved = repo.save(purchase);

        String date = saved.getCreatedAt()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        saved.setInvoiceNumber("PUR-" + date + "-" + saved.getId());
        repo.save(saved);

        // ✅ Inventory auto update
        inventoryService.addStock(
                saved.getItemName(),
                saved.getCategory(),
                saved.getQuantity()
        );

        return saved;
    }

    @Transactional
    public Purchase update(Long id, Purchase updatedPurchase) {
        Purchase existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found: " + id));

        Integer oldQuantity = existing.getQuantity();
        Integer newQuantity = updatedPurchase.getQuantity();

        existing.setItemName(updatedPurchase.getItemName());
        existing.setCategory(updatedPurchase.getCategory());
        existing.setQuantity(newQuantity);
        existing.setUnitPrice(updatedPurchase.getUnitPrice());
        existing.setPurchaseDate(updatedPurchase.getPurchaseDate());
        existing.setStatus(updatedPurchase.getStatus());
        existing.setNote(updatedPurchase.getNote());
        existing.setPaymentMethod(updatedPurchase.getPaymentMethod());
        existing.setAccountNumber(updatedPurchase.getAccountNumber());
        existing.setBankName(updatedPurchase.getBankName());;

        if (newQuantity != null && existing.getUnitPrice() != null) {
            existing.setTotalAmount(newQuantity * existing.getUnitPrice());
        }

        // ✅ Inventory adjust — difference হিসাব করে
        inventoryService.adjustStock(existing.getItemName(), oldQuantity, newQuantity);

        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Purchase purchase = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found: " + id));

        // Inventory তে item থাকলে কমাও, না থাকলে skip করো
        inventoryRepo.findByItemName(purchase.getItemName())
                .ifPresent(inventory -> {
                    int updatedQty = inventory.getCurrentQuantity() - purchase.getQuantity();
                    inventory.setCurrentQuantity(Math.max(updatedQty, 0));
                    inventory.setStatus(inventory.getCurrentQuantity() > 0 ? "In Stock" : "Out of Stock");
                    inventoryRepo.save(inventory);
                });

        repo.deleteById(id);
    }
}