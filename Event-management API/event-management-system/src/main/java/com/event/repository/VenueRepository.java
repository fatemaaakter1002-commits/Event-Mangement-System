package com.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.event.entity.Venue;

public interface VenueRepository extends JpaRepository<Venue, Long> {}