package com.finance.tracker.service;

import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {
    List<Expense> getAllExpenses(User user);
    Expense getExpenseById(Long id, User user);
    Expense createExpense(Expense expense, User user);
    Expense updateExpense(Long id, Expense expense, User user);
    void deleteExpense(Long id, User user);
    List<Expense> getExpensesBetween(User user, LocalDate start, LocalDate end);
}
