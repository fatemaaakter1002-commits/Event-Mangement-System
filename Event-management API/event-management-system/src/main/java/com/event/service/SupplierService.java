package com.event.service;

import com.event.entity.Supplier;
import com.event.repository.PurchaseRepository;
import com.event.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository repository;
    private final PurchaseRepository purchaseRepository;

    public SupplierService(SupplierRepository repository,
                           PurchaseRepository purchaseRepository) {
        this.repository = repository;
        this.purchaseRepository = purchaseRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return repository.findAll();
    }

    public Supplier getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
    }

    public Supplier saveSupplier(Supplier supplier) {
        return repository.save(supplier);
    }

    public Supplier update(Long id, Supplier updated) {
        Supplier existing = getById(id);
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setCompany(updated.getCompany());
        existing.setAddress(updated.getAddress());
        existing.setPaymentTerms(updated.getPaymentTerms());
        existing.setStatus(updated.getStatus());
        existing.setNotes(updated.getNotes());
        return repository.save(existing);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        // আগে এই supplier এর সব purchase delete করো
        purchaseRepository.deleteBySupplierId(id);
        // তারপর supplier delete করো
        repository.deleteById(id);
    }
}