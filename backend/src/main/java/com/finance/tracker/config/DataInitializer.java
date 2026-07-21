package com.finance.tracker.config;

import com.finance.tracker.entity.*;
import com.finance.tracker.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;

    public DataInitializer(UserRepository userRepository,
                           IncomeRepository incomeRepository,
                           ExpenseRepository expenseRepository,
                           BudgetRepository budgetRepository,
                           SavingsGoalRepository savingsGoalRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("--- PRE-POPULATING DEMO DATA FOR PERSONAL FINANCE TRACKER ---");

            // 1. Create Default Guest User
            User guest = userRepository.save(new User("Guest User", "guest@example.com", "Password123"));

            // 2. Compute current month dynamics (so charts automatically show data on launch)
            LocalDate today = LocalDate.now();
            String currentMonthYear = today.format(DateTimeFormatter.ofPattern("yyyy-MM"));

            // 3. Populate Budgets
            budgetRepository.save(new Budget(guest, "Food & Dining", new BigDecimal("2000.00"), currentMonthYear));
            budgetRepository.save(new Budget(guest, "Rent & Housing", new BigDecimal("3500.00"), currentMonthYear));
            budgetRepository.save(new Budget(guest, "Transportation", new BigDecimal("500.00"), currentMonthYear));
            budgetRepository.save(new Budget(guest, "Entertainment", new BigDecimal("500.00"), currentMonthYear));

            // 4. Populate Incomes (Total: 12,500.00)
            incomeRepository.save(new Income("Monthly Salary", new BigDecimal("10000.00"), today.withDayOfMonth(1), "Salary", guest));
            incomeRepository.save(new Income("Web Dev Freelance Work", new BigDecimal("2500.00"), today.withDayOfMonth(5), "Freelance", guest));

            // 5. Populate Expenses (Total: 5,550.00)
            // Food spent: 1,650.00 / 2,000.00 (within limit)
            expenseRepository.save(new Expense("Supermarket Grocery Shopping", new BigDecimal("1200.00"), today.withDayOfMonth(10), "Food & Dining", guest));
            expenseRepository.save(new Expense("Sushi Dinner with Friends", new BigDecimal("450.00"), today.withDayOfMonth(12), "Food & Dining", guest));
            
            // Rent spent: 3,000.00 / 3,500.00 (within limit)
            expenseRepository.save(new Expense("Monthly Apartment Rent", new BigDecimal("3000.00"), today.withDayOfMonth(1), "Rent & Housing", guest));
            
            // Trans spent: 300.00 / 500.00 (within limit)
            expenseRepository.save(new Expense("Uber Rides to Work", new BigDecimal("300.00"), today.withDayOfMonth(14), "Transportation", guest));
            
            // Ent spent: 600.00 / 500.00 (EXCEEDS LIMIT - triggers red alert card on dashboard!)
            expenseRepository.save(new Expense("Cinema Movie Night & Popcorn", new BigDecimal("600.00"), today.withDayOfMonth(15), "Entertainment", guest));

            // 6. Populate Savings Goals
            savingsGoalRepository.save(new SavingsGoal("Emergency Fund", new BigDecimal("15000.00"), new BigDecimal("10000.00"), today.plusYears(1), guest));
            savingsGoalRepository.save(new SavingsGoal("New Gaming Laptop", new BigDecimal("8000.00"), new BigDecimal("8000.00"), today.plusMonths(1), guest));

            System.out.println("--- DEMO DATA INITIALIZATION COMPLETED SUCCESSFULY ---");
        }
    }
}
