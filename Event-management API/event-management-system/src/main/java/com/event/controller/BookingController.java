package com.event.controller;

import com.event.entity.Booking;
import com.event.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestParam String venue,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam(required = false) Long excludeId) {
        boolean available = bookingService.isAvailable(venue, date, startTime, endTime, excludeId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", available);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public Booking save(@RequestBody Booking booking) {
        return bookingService.save(booking);
    }

    @GetMapping
    public List<Booking> getAll() {
        return bookingService.getAll();
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Long id) {
        return bookingService.getById(id);
    }

    @PutMapping("/{id}")
    public Booking update(@PathVariable Long id, @RequestBody Booking booking) {
        return bookingService.update(id, booking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/client/{clientName}")
    public List<Booking> getByClientName(@PathVariable String clientName) {
        return bookingService.getByClientName(clientName);
    }

    @PatchMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody String newStatus) {
        return bookingService.updateStatusOnly(id, newStatus);
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return bookingService.getDashboardStats();
    }
}