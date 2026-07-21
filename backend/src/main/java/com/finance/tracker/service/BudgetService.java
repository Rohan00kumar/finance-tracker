package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.entity.User;
import java.util.List;

public interface BudgetService {
    List<BudgetResponse> getAllBudgets(User user, String monthYear);
    BudgetResponse createOrUpdateBudget(BudgetRequest request, User user);
    void deleteBudget(Long id, User user);
}
