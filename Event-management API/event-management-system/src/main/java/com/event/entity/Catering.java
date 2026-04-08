package com.event.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Catering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("cateringId")
    private Long cateringId;

    private String name;
    private String category;
    private Double price;
    private String type;
    private String status;

    private String createdAt;

    @PrePersist
    public void createdTime() {
        createdAt = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                        .format(java.time.LocalDateTime.now());
    }

    public Catering() {}

    public Long getId() { return cateringId; }
    public void setId(Long id) { this.cateringId = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}