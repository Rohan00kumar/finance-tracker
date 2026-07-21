package com.finance.tracker.service;

import com.finance.tracker.entity.SavingsGoal;
import com.finance.tracker.entity.User;
import java.util.List;

public interface SavingsGoalService {
    List<SavingsGoal> getAllSavingsGoals(User user);
    SavingsGoal getSavingsGoalById(Long id, User user);
    SavingsGoal createSavingsGoal(SavingsGoal savingsGoal, User user);
    SavingsGoal updateSavingsGoal(Long id, SavingsGoal savingsGoal, User user);
    void deleteSavingsGoal(Long id, User user);
}
