package com.event.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.event.entity.Event;
import com.event.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository repo;

    public EventService(EventRepository repo){
        this.repo = repo;
    }

    public Event save(Event event){
        return repo.save(event);
    }

    public List<Event> getAll(){
        return repo.findAll();
    }

    public void delete(Long id){
        repo.deleteById(id);
    }
}