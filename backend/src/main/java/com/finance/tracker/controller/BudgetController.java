package com.finance.tracker.controller;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.dto.MessageResponse;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final UserRepository userRepository;

    public BudgetController(BudgetService budgetService, UserRepository userRepository) {
        this.budgetService = budgetService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        return userRepository.findById(1L)
                .orElseGet(() -> userRepository.save(new User("Guest User", "guest@example.com", "Password123")));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets(@RequestParam String monthYear) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(budgetService.getAllBudgets(user, monthYear));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createOrUpdateBudget(@Valid @RequestBody BudgetRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(budgetService.createOrUpdateBudget(request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        budgetService.deleteBudget(id, user);
        return ResponseEntity.ok(new MessageResponse("Budget limit deleted successfully"));
    }
}
