package com.event.controller;

import com.event.entity.Catering;
import com.event.service.CateringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catering")
public class CateringController {

    private final CateringService service;

    public CateringController(CateringService service) {
        this.service = service;
    }

    @GetMapping
    public List<Catering> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Catering> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Catering save(@RequestBody Catering catering) {
        return service.save(catering);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Catering> update(@PathVariable Long id, @RequestBody Catering catering) {
        return service.update(id, catering)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}