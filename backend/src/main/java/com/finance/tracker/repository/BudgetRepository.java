package com.finance.tracker.repository;

import com.finance.tracker.model.Budget;
import com.finance.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonthYear(User user, String monthYear);
    Optional<Budget> findByUserAndCategoryAndMonthYear(User user, String category, String monthYear);
}
