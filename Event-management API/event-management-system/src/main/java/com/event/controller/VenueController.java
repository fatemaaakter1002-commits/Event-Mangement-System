package com.event.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.event.entity.Venue;
import com.event.service.VenueService;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService service;

    public VenueController(VenueService service){
        this.service = service;
    }

    @PostMapping
    public Venue save(@RequestBody Venue venue){
        return service.save(venue);
    }

    @GetMapping
    public List<Venue> getAll(){
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){  // ← CHANGE THIS
        service.delete(id);
        return ResponseEntity.noContent().build();  // Returns 204, no body
    }

    @PutMapping("/{id}")          // ← ADD THIS
    public ResponseEntity<Venue> update(@PathVariable Long id, @RequestBody Venue venue){
        return ResponseEntity.ok(service.update(id, venue));
    }
}