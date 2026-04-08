package com.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.event.entity.Booking;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByClientName(String clientName);

    @Query("SELECT b FROM Booking b WHERE b.venue = :venue AND b.date = :date " +
           "AND b.status = 'Confirmed' " +
           "AND (:startTime < b.endTime AND :endTime > b.startTime) " +
           "AND (:excludeId IS NULL OR b.id != :excludeId)")
    List<Booking> findOverlappingBookings(
        @Param("venue") String venue, 
        @Param("date") String date, 
        @Param("startTime") String startTime, 
        @Param("endTime") String endTime,
        @Param("excludeId") Long excludeId);
}