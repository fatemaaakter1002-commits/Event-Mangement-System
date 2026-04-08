package com.event.service;

import com.event.entity.Catering;
import com.event.repository.CateringRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CateringService {

    private final CateringRepository repo;

    public CateringService(CateringRepository repo) {
        this.repo = repo;
    }

    public List<Catering> getAll() {
        return repo.findAll();
    }

    public Optional<Catering> getById(Long id) {
        return repo.findById(id);
    }

    public Catering save(Catering catering) {
        return repo.save(catering);
    }

    public Optional<Catering> update(Long id, Catering updated) {
        return repo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setCategory(updated.getCategory());
            existing.setPrice(updated.getPrice());
            existing.setType(updated.getType());
            existing.setStatus(updated.getStatus());
            return repo.save(existing);
        });
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}