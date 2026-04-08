package com.event.controller;

import com.event.entity.Purchase;
import com.event.service.PurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService service;

    public PurchaseController(PurchaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Purchase> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Purchase getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/supplier/{supplierId}")
    public List<Purchase> getBySupplierId(@PathVariable Long supplierId) {
        return service.getBySupplierId(supplierId);
    }

    @PostMapping("/supplier/{supplierId}")
    public Purchase save(@PathVariable Long supplierId,
                         @RequestBody Purchase purchase) {
        return service.save(supplierId, purchase);
    }

    // ✅ নতুন update endpoint
    @PutMapping("/{id}")
    public Purchase update(@PathVariable Long id,
                           @RequestBody Purchase purchase) {
        return service.update(id, purchase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}