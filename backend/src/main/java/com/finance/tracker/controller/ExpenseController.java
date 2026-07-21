package com.finance.tracker.controller;

import com.finance.tracker.dto.MessageResponse;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseService expenseService, UserRepository userRepository) {
        this.expenseService = expenseService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        return userRepository.findById(1L)
                .orElseGet(() -> userRepository.save(new User("Guest User", "guest@example.com", "Password123")));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(expenseService.getAllExpenses(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(expenseService.getExpenseById(id, user));
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(expenseService.createExpense(expense, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expense) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(expenseService.updateExpense(id, expense, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        expenseService.deleteExpense(id, user);
        return ResponseEntity.ok(new MessageResponse("Expense record deleted successfully"));
    }
}
