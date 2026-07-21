package com.finance.tracker.service;

import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<Expense> getAllExpenses(User user) {
        return expenseRepository.findByUserOrderByDateDesc(user);
    }

    @Override
    public Expense getExpenseById(Long id, User user) {
        return expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found or unauthorized"));
    }

    @Override
    public Expense createExpense(Expense expense, User user) {
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    @Override
    public Expense updateExpense(Long id, Expense expenseDetails, User user) {
        Expense expense = getExpenseById(id, user);
        expense.setTitle(expenseDetails.getTitle());
        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());
        expense.setCategory(expenseDetails.getCategory());
        return expenseRepository.save(expense);
    }

    @Override
    public void deleteExpense(Long id, User user) {
        Expense expense = getExpenseById(id, user);
        expenseRepository.delete(expense);
    }

    @Override
    public List<Expense> getExpensesBetween(User user, LocalDate start, LocalDate end) {
        return expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
    }
}
