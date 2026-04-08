package com.event.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import jakarta.persistence.*;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;
    private String event;
    private String venue;
    private String date;
    private String startTime;
    private String endTime;
    private int guests;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String starters;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String mains;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String drinks;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String desserts;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String requirements;

    private Double venueCost;
    private Double foodCost;
    private Double decorationCost;
    private Double otherCost;
    private Double total;
    private Double paid;
    private Double remaining;
    private String paymentStatus;
    private String paymentMethod;
    private String status;

    private String bkashNumber;
    private String nagadNumber;
    private String bankName;
    private String bankAccountNumber;
    private String bookingFromNumber;
    private String bookingType; // Online/Offline

    @Column(updatable = false)
    private String createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd")
                        .format(java.time.LocalDateTime.now());
        if (this.bookingType == null) {
            this.bookingType = "Offline"; // Default to offline for Admin creations
        }
    }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getEvent() { return event; }
    public void setEvent(String event) { this.event = event; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public int getGuests() { return guests; }
    public void setGuests(int guests) { this.guests = guests; }

    public String getStarters() { return starters; }
    @JsonProperty("starters")
    public void setStarters(String starters) { this.starters = starters; }

    public String getMains() { return mains; }
    @JsonProperty("mains")
    public void setMains(String mains) { this.mains = mains; }

    public String getDrinks() { return drinks; }
    @JsonProperty("drinks")
    public void setDrinks(String drinks) { this.drinks = drinks; }

    public String getDesserts() { return desserts; }
    @JsonProperty("desserts")
    public void setDesserts(String desserts) { this.desserts = desserts; }

    public String getRequirements() { return requirements; }
    @JsonProperty("requirements")
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public Double getVenueCost() { return venueCost; }
    public void setVenueCost(Double venueCost) { this.venueCost = venueCost; }

    public Double getFoodCost() { return foodCost; }
    public void setFoodCost(Double foodCost) { this.foodCost = foodCost; }

    public Double getDecorationCost() { return decorationCost; }
    public void setDecorationCost(Double decorationCost) { this.decorationCost = decorationCost; }

    public Double getOtherCost() { return otherCost; }
    public void setOtherCost(Double otherCost) { this.otherCost = otherCost; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Double getPaid() { return paid; }
    public void setPaid(Double paid) { this.paid = paid; }

    public Double getRemaining() { return remaining; }
    public void setRemaining(Double remaining) { this.remaining = remaining; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBkashNumber() { return bkashNumber; }
    public void setBkashNumber(String bkashNumber) { this.bkashNumber = bkashNumber; }

    public String getNagadNumber() { return nagadNumber; }
    public void setNagadNumber(String nagadNumber) { this.nagadNumber = nagadNumber; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getBookingFromNumber() { return bookingFromNumber; }
    public void setBookingFromNumber(String bookingFromNumber) { this.bookingFromNumber = bookingFromNumber; }

    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }
}