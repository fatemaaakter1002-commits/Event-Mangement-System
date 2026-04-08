package com.event.repository;

import com.event.entity.Catering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CateringRepository extends JpaRepository<Catering, Long> {
}