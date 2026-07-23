package com.finance.tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets",
       uniqueConstraints = {
         @UniqueConstraint(columnNames = {"user_id", "category", "monthYear"})
       })
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    private String category;

    @NotNull
    private BigDecimal limitAmount;

    @NotBlank
    private String monthYear; // Format: YYYY-MM

    @Column(name = "spent_amount")
    private BigDecimal spentAmount;

    public Budget() {
    }

    public Budget(User user, String category, BigDecimal limitAmount, String monthYear) {
        this.user = user;
        this.category = category;
        this.limitAmount = limitAmount;
        this.monthYear = monthYear;
    }

    public Budget(User user, String category, BigDecimal limitAmount, String monthYear, BigDecimal spentAmount) {
        this.user = user;
        this.category = category;
        this.limitAmount = limitAmount;
        this.monthYear = monthYear;
        this.spentAmount = spentAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void setLimitAmount(BigDecimal limitAmount) {
        this.limitAmount = limitAmount;
    }

    public String getMonthYear() {
        return monthYear;
    }

    public void setMonthYear(String monthYear) {
        this.monthYear = monthYear;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }
}
