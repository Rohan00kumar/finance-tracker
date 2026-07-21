package com.finance.tracker.repository;

import com.finance.tracker.entity.SavingsGoal;
import com.finance.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    List<SavingsGoal> findByUser(User user);
}
