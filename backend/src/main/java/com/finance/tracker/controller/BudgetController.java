package com.finance.tracker.controller;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.security.UserDetailsImpl;
import com.finance.tracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
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
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(@RequestParam(required = false) String monthYear) {
        if (monthYear == null || monthYear.trim().isEmpty()) {
            monthYear = LocalDate.now().toString().substring(0, 7); // Default to YYYY-MM
        }
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
        return ResponseEntity.ok().build();
    }
}
