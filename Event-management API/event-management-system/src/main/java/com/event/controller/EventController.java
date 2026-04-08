package com.event.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.event.entity.Event;
import com.event.service.EventService;

@RestController
@RequestMapping("/api/events")

public class EventController {

    private final EventService service;

    public EventController(EventService service){
        this.service = service;
    }

    @PostMapping
    public Event save(@RequestBody Event event){
        return service.save(event);
    }

    @GetMapping
    public List<Event> getAll(){
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}