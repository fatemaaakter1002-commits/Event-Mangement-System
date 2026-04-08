package com.event.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.event.entity.Venue;
import com.event.repository.VenueRepository;

@Service
public class VenueService {

    private final VenueRepository repo;

    public VenueService(VenueRepository repo){
        this.repo = repo;
    }

    public Venue save(Venue venue){
        return repo.save(venue);
    }

    public List<Venue> getAll(){
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Venue update(Long id, Venue updated) {   // ← ADD THIS
        Venue existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        existing.setName(updated.getName());
        existing.setLocation(updated.getLocation());
        existing.setCapacity(updated.getCapacity());
        existing.setPrice(updated.getPrice());
        existing.setStatus(updated.getStatus());
        return repo.save(existing);
    }
}