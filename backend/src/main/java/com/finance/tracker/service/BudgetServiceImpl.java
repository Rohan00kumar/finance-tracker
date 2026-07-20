package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.model.Budget;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.TransactionType;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.TransactionRepository;
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
    private final TransactionRepository transactionRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository, TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<BudgetResponse> getAllBudgets(User user, String monthYear) {
        // Find all budgets for user in this month
        List<Budget> budgets = budgetRepository.findByUserAndMonthYear(user, monthYear);

        // Fetch all transactions in this month to calculate spent amount per category
        YearMonth ym = YearMonth.parse(monthYear);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);

        Map<String, BigDecimal> spentMap = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().toLowerCase(),
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));

        return budgets.stream()
                .map(b -> {
                    BigDecimal spent = spentMap.getOrDefault(b.getCategory().toLowerCase(), BigDecimal.ZERO);
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
        } else {
            budget = new Budget(
                    user,
                    request.getCategory(),
                    request.getLimitAmount(),
                    request.getMonthYear()
            );
        }

        Budget saved = budgetRepository.save(budget);

        // Compute spent amount for this single budget to return response
        YearMonth ym = YearMonth.parse(request.getMonthYear());
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, ym.atDay(1), ym.atEndOfMonth());
        BigDecimal spent = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE && t.getCategory().equalsIgnoreCase(request.getCategory()))
                .map(Transaction::getAmount)
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
