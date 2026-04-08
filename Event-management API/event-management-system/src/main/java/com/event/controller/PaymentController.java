package com.event.controller;

import com.event.entity.Payment;
import com.event.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/booking/{bookingId}")
    public Payment save(@PathVariable Long bookingId,
                        @RequestBody Payment payment) {
        return paymentService.save(bookingId, payment);
    }

    @GetMapping
    public List<Payment> getAll() {
        return paymentService.getAll();
    }

    @GetMapping("/booking/{bookingId}")
    public List<Payment> getByBookingId(@PathVariable Long bookingId) {
        return paymentService.getByBookingId(bookingId);
    }

    @GetMapping("/{id}")
    public Payment getById(@PathVariable Long id) {
        return paymentService.getById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paymentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}