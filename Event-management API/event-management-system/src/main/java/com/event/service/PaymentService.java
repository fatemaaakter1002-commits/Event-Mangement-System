package com.event.service;

import com.event.entity.Booking;
import com.event.entity.Payment;
import com.event.repository.BookingRepository;
import com.event.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    // ✅ Booking এর paid/remaining/status recalculate
    private void recalculateBooking(Booking booking) {
        Double totalPaid = paymentRepository
                .getTotalPaidByBookingId(booking.getId());

        double paid      = totalPaid != null ? totalPaid : 0;
        double remaining = booking.getTotal() - paid;

        booking.setPaid(paid);
        booking.setRemaining(remaining);

        if (paid <= 0) {
            booking.setPaymentStatus("Pending");
            booking.setStatus("Pending");
        } else if (remaining > 0) {
            booking.setPaymentStatus("Partial");
            booking.setStatus("Pending");
        } else {
            booking.setPaymentStatus("Paid");
            booking.setStatus("Confirmed");
        }

        bookingRepository.save(booking);
    }

    @Transactional
    public Payment save(Long bookingId, Payment payment) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        payment.setBooking(booking);
        Payment saved = paymentRepository.save(payment);

        // ✅ Save করার পর booking auto update
        recalculateBooking(booking);

        return saved;
    }

    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    public List<Payment> getByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public Payment getById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
    }

    @Transactional
    public void delete(Long id) {
        Payment payment = getById(id);
        Booking booking = payment.getBooking();
        
        // ✅ Delete the payment first (optional since booking delete cascades in BookingService)
        paymentRepository.deleteById(id);

        // ✅ Instead of recalculating, we delete the entire booking 
        // to prevent it moving back to "Pending" dues as per user request.
        if (booking != null) {
            // We use bookingRepository directly or bookingService if available.
            // BookingService.delete handles payment deletion already.
            List<Payment> allRelatedPayments = paymentRepository.findByBookingId(booking.getId());
            if (!allRelatedPayments.isEmpty()) {
                paymentRepository.deleteAll(allRelatedPayments);
            }
            bookingRepository.deleteById(booking.getId());
        }
    }
}