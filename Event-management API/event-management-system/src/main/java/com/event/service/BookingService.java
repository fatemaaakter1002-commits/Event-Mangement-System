package com.event.service;

import com.event.entity.Booking;
import com.event.entity.Payment;
import com.event.repository.BookingRepository;
import com.event.repository.VenueRepository;
import com.event.repository.EventRepository;
import com.event.repository.PaymentRepository;
import com.event.exception.BookingConflictException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final PaymentRepository paymentRepository;

    public BookingService(BookingRepository bookingRepository, 
                         VenueRepository venueRepository, 
                         EventRepository eventRepository,
                         PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
        this.paymentRepository = paymentRepository;
    }

    private String cleanJson(String value) {
        if (value == null || value.trim().isEmpty()) return "[]";
        String cleaned = value.trim();
        // Ensure it looks like JSON array or object
        if (!cleaned.startsWith("[") && !cleaned.startsWith("{")) {
            // If it's a plain string, wrap it in an array to be safe for multi-select
            return "[\"" + cleaned.replace("\"", "\\\"") + "\"]";
        }
        return cleaned;
    }

    // ✅ Auto status based on payment
    private void updateBookingStatus(Booking booking) {
        double paid = booking.getPaid() != null ? booking.getPaid() : 0.0;
        double total = booking.getTotal() != null ? booking.getTotal() : 0.0;
        double remaining = booking.getRemaining() != null ? booking.getRemaining() : (total - paid);

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
    }

    private void validateOverlap(Booking booking) {
        if (!isAvailable(booking.getVenue(), booking.getDate(), booking.getStartTime(), booking.getEndTime(), booking.getId())) {
            throw new BookingConflictException("CONFLICT: The venue '" + booking.getVenue() + 
                "' is already reserved for " + booking.getStartTime() + " - " + booking.getEndTime() + 
                ". Please select a different time slot or an alternative venue.");
        }
    }

    public boolean isAvailable(String venue, String date, String startTime, String endTime, Long excludeId) {
        if (venue == null || date == null || startTime == null || endTime == null || 
            venue.isEmpty() || date.isEmpty() || startTime.isEmpty() || endTime.isEmpty()) {
            return true;
        }
        
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(venue, date, startTime, endTime, excludeId);
        return conflicts.isEmpty();
    }

    private Booking sanitize(Booking booking) {
        if (booking == null) return null;
        booking.setStarters(cleanJson(booking.getStarters()));
        booking.setMains(cleanJson(booking.getMains()));
        booking.setDrinks(cleanJson(booking.getDrinks()));
        booking.setDesserts(cleanJson(booking.getDesserts()));
        booking.setRequirements(cleanJson(booking.getRequirements()));
        return booking;
    }

    public Booking save(Booking booking) {
        validateOverlap(booking);
        sanitize(booking);
        updateBookingStatus(booking);             
        Booking saved = bookingRepository.save(booking);

        // ✅ If initial paid > 0, create a Payment record to maintain audit trail
        if (saved.getPaid() != null && saved.getPaid() > 0) {
            Payment p = new Payment();
            p.setBooking(saved);
            p.setAmount(saved.getPaid());
            p.setPaymentDate(LocalDate.now());
            p.setPaymentType("Down Payment");
            p.setPaymentMethod(saved.getPaymentMethod() != null ? saved.getPaymentMethod() : "Cash");
            p.setNote("Initial Advance Payment");
            paymentRepository.save(p);
        }
        
        return saved;
    }

    public List<Booking> getAll() {
        List<Booking> bookings = bookingRepository.findAll();
        bookings.forEach(this::sanitize);
        return bookings;
    }

    public Booking getById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        return sanitize(booking);
    }

    public Booking update(Long id, Booking updatedBooking) {
        Booking existing = getById(id);
        existing.setClientName(updatedBooking.getClientName());
        existing.setEvent(updatedBooking.getEvent());
        existing.setVenue(updatedBooking.getVenue());
        existing.setDate(updatedBooking.getDate());
        existing.setStartTime(updatedBooking.getStartTime());
        existing.setEndTime(updatedBooking.getEndTime());
        
        validateOverlap(existing);

        existing.setGuests(updatedBooking.getGuests());
        
        // Use sanitize to apply the cleanJson logic
        existing.setStarters(updatedBooking.getStarters());
        existing.setMains(updatedBooking.getMains());
        existing.setDrinks(updatedBooking.getDrinks());
        existing.setDesserts(updatedBooking.getDesserts());
        existing.setRequirements(updatedBooking.getRequirements());
        sanitize(existing);

        existing.setVenueCost(updatedBooking.getVenueCost());
        existing.setFoodCost(updatedBooking.getFoodCost());
        existing.setDecorationCost(updatedBooking.getDecorationCost());
        existing.setOtherCost(updatedBooking.getOtherCost());
        existing.setTotal(updatedBooking.getTotal());
        existing.setPaid(updatedBooking.getPaid());
        existing.setRemaining(updatedBooking.getRemaining());
        updateBookingStatus(existing);            // ← status update
        return bookingRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        // ✅ Delete related payments first to avoid foreign key constraint issues
        List<Payment> payments = paymentRepository.findByBookingId(id);
        if (!payments.isEmpty()) {
            paymentRepository.deleteAll(payments);
        }
        
        bookingRepository.deleteById(id);
    }

    public List<Booking> getByClientName(String clientName) {
        List<Booking> bookings = bookingRepository.findByClientName(clientName);
        bookings.forEach(this::sanitize);
        return bookings;
    }

    public Booking updateStatusOnly(Long id, String newStatus) {
        Booking existing = getById(id);
        existing.setStatus(newStatus);
        return bookingRepository.save(existing);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        String today = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd")
                        .format(java.time.LocalDateTime.now());

        stats.put("totalBookings", bookingRepository.count());
        stats.put("totalVenues", venueRepository.count());
        stats.put("totalEvents", eventRepository.count());

        // Lifetime Stats
        stats.put("totalOnline", bookingRepository.findAll().stream()
                .filter(b -> "Online".equalsIgnoreCase(b.getBookingType())).count());
        stats.put("totalOffline", bookingRepository.findAll().stream()
                .filter(b -> !"Online".equalsIgnoreCase(b.getBookingType())).count());

        // Today's Stats (Using createdAt Field with Fallback)
        stats.put("todayOnline", bookingRepository.findAll().stream()
                .filter(b -> "Online".equalsIgnoreCase(b.getBookingType()) && 
                             (today.equals(b.getCreatedAt()) || (b.getDate() != null && b.getDate().startsWith(today))))
                .count());
        stats.put("todayOffline", bookingRepository.findAll().stream()
                .filter(b -> !"Online".equalsIgnoreCase(b.getBookingType()) && 
                             (today.equals(b.getCreatedAt()) || (b.getDate() != null && b.getDate().startsWith(today))))
                .count());

        return stats;
    }
}