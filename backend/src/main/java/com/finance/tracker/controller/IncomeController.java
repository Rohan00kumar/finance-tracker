package com.finance.tracker.controller;

import com.finance.tracker.dto.MessageResponse;
import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;
    private final UserRepository userRepository;

    public IncomeController(IncomeService incomeService, UserRepository userRepository) {
        this.incomeService = incomeService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        return userRepository.findById(1L)
                .orElseGet(() -> userRepository.save(new User("Guest User", "guest@example.com", "Password123")));
    }

    @GetMapping
    public ResponseEntity<List<Income>> getAllIncomes() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(incomeService.getAllIncomes(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Income> getIncomeById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(incomeService.getIncomeById(id, user));
    }

    @PostMapping
    public ResponseEntity<Income> createIncome(@Valid @RequestBody Income income) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(incomeService.createIncome(income, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long id, @Valid @RequestBody Income income) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(incomeService.updateIncome(id, income, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        incomeService.deleteIncome(id, user);
        return ResponseEntity.ok(new MessageResponse("Income record deleted successfully"));
    }
}
