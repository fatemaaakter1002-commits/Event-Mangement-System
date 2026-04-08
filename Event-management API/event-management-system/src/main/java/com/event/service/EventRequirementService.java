package com.event.service;

import com.event.entity.EventRequirement;
import com.event.repository.EventRequirementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventRequirementService {

    private final EventRequirementRepository repo;

    public EventRequirementService(EventRequirementRepository repo){
        this.repo = repo;
    }

    public List<EventRequirement> getAll(){
        return repo.findAll();
    }

    public EventRequirement save(EventRequirement eventRequirement){
        return repo.save(eventRequirement);
    }

}