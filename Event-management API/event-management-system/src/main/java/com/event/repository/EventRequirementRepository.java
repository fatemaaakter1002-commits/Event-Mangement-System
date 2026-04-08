package com.event.repository;

import com.event.entity.EventRequirement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRequirementRepository extends JpaRepository<EventRequirement,Long> {
}