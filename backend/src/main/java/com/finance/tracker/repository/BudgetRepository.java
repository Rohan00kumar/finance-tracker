package com.finance.tracker.repository;

import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonthYear(User user, String monthYear);
    Optional<Budget> findByUserAndCategoryAndMonthYear(User user, String category, String monthYear);
}
