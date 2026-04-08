package com.event.controller;

import com.event.entity.EventRequirement;
import com.event.service.EventRequirementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventRequirement")
public class EventRequirementController {

    private final EventRequirementService service;

    public EventRequirementController(EventRequirementService service){
        this.service = service;
    }

    @GetMapping
    public List<EventRequirement> getAll(){
        return service.getAll();
    }

    @PostMapping
    public EventRequirement save(@RequestBody EventRequirement eventRequirement){
        return service.save(eventRequirement);
    }

}