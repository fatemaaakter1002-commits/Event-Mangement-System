package com.event.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class EventRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventRequirementId;

    @ManyToOne
    @JoinColumn(name="event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name="requirement_id")
    private Requirement requirement;

    private Integer quantity;

    private LocalDateTime createdAt;

    @PrePersist
    public void created(){
        createdAt = LocalDateTime.now();
    }

    public EventRequirement(){}

    public Long getEventRequirementId() {
        return eventRequirementId;
    }

    public void setEventRequirementId(Long eventRequirementId) {
        this.eventRequirementId = eventRequirementId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Requirement getRequirement() {
        return requirement;
    }

    public void setRequirement(Requirement requirement) {
        this.requirement = requirement;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}