package com.event.controller;

import com.event.entity.Requirement;
import com.event.service.RequirementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
public class RequirementController {

    private final RequirementService service;

    public RequirementController(RequirementService service){
        this.service = service;
    }

    @GetMapping
    public List<Requirement> getAll(){
        return service.getAll();
    }

    @PostMapping
    public Requirement save(@RequestBody Requirement requirement){
        return service.save(requirement);
    }

}