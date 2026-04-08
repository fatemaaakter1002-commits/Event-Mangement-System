package com.event.service;

import com.event.entity.Requirement;
import com.event.repository.RequirementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequirementService {

    private final RequirementRepository repo;

    public RequirementService(RequirementRepository repo){
        this.repo = repo;
    }

    public List<Requirement> getAll(){
        return repo.findAll();
    }

    public Requirement save(Requirement requirement){
        return repo.save(requirement);
    }

}