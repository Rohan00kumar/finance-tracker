package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<BudgetResponse> getAllBudgets(User user, String monthYear) {
        List<Budget> budgets = budgetRepository.findByUserAndMonthYear(user, monthYear);

        YearMonth ym = YearMonth.parse(monthYear);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Expense> expenses = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);

        Map<String, BigDecimal> spentMap = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().toLowerCase(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        return budgets.stream()
                .map(b -> {
                    BigDecimal spent = b.getSpentAmount() != null 
                            ? b.getSpentAmount() 
                            : spentMap.getOrDefault(b.getCategory().toLowerCase(), BigDecimal.ZERO);
                    return new BudgetResponse(
                            b.getId(),
                            b.getCategory(),
                            b.getLimitAmount(),
                            b.getMonthYear(),
                            spent
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public BudgetResponse createOrUpdateBudget(BudgetRequest request, User user) {
        Optional<Budget> existing = budgetRepository.findByUserAndCategoryAndMonthYear(
                user, request.getCategory(), request.getMonthYear()
        );

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setLimitAmount(request.getLimitAmount());
            if (request.getSpentAmount() != null) {
                budget.setSpentAmount(request.getSpentAmount());
            }
        } else {
            budget = new Budget(
                    user,
                    request.getCategory(),
                    request.getLimitAmount(),
                    request.getMonthYear()
            );
            if (request.getSpentAmount() != null) {
                budget.setSpentAmount(request.getSpentAmount());
            }
        }

        Budget saved = budgetRepository.save(budget);

        YearMonth ym = YearMonth.parse(request.getMonthYear());
        List<Expense> expenses = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, ym.atDay(1), ym.atEndOfMonth());
        BigDecimal spent = saved.getSpentAmount() != null 
                ? saved.getSpentAmount() 
                : expenses.stream()
                        .filter(e -> e.getCategory().equalsIgnoreCase(request.getCategory()))
                        .map(Expense::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new BudgetResponse(
                saved.getId(),
                saved.getCategory(),
                saved.getLimitAmount(),
                saved.getMonthYear(),
                spent
        );
    }

    @Override
    public void deleteBudget(Long id, User user) {
        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found or unauthorized"));
        budgetRepository.delete(budget);
    }
}
