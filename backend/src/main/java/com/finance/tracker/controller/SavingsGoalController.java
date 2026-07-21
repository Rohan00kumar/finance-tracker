package com.finance.tracker.controller;

import com.finance.tracker.dto.MessageResponse;
import com.finance.tracker.dto.SavingsGoalRequest;
import com.finance.tracker.dto.SavingsGoalResponse;
import com.finance.tracker.entity.SavingsGoal;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.service.SavingsGoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/savings")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;
    private final UserRepository userRepository;

    public SavingsGoalController(SavingsGoalService savingsGoalService, UserRepository userRepository) {
        this.savingsGoalService = savingsGoalService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        return userRepository.findById(1L)
                .orElseGet(() -> userRepository.save(new User("Guest User", "guest@example.com", "Password123")));
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoalResponse>> getAllSavingsGoals() {
        User user = getAuthenticatedUser();
        List<SavingsGoalResponse> responses = savingsGoalService.getAllSavingsGoals(user).stream()
                .map(sg -> new SavingsGoalResponse(sg.getId(), sg.getTitle(), sg.getTargetAmount(), sg.getCurrentAmount(), sg.getTargetDate()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<SavingsGoalResponse> createSavingsGoal(@Valid @RequestBody SavingsGoalRequest request) {
        User user = getAuthenticatedUser();
        SavingsGoal sg = new SavingsGoal(request.getTitle(), request.getTargetAmount(), request.getCurrentAmount(), request.getTargetDate(), user);
        SavingsGoal saved = savingsGoalService.createSavingsGoal(sg, user);
        return ResponseEntity.ok(new SavingsGoalResponse(saved.getId(), saved.getTitle(), saved.getTargetAmount(), saved.getCurrentAmount(), saved.getTargetDate()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoalResponse> updateSavingsGoal(@PathVariable Long id, @Valid @RequestBody SavingsGoalRequest request) {
        User user = getAuthenticatedUser();
        SavingsGoal sg = new SavingsGoal(request.getTitle(), request.getTargetAmount(), request.getCurrentAmount(), request.getTargetDate(), user);
        SavingsGoal updated = savingsGoalService.updateSavingsGoal(id, sg, user);
        return ResponseEntity.ok(new SavingsGoalResponse(updated.getId(), updated.getTitle(), updated.getTargetAmount(), updated.getCurrentAmount(), updated.getTargetDate()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavingsGoal(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        savingsGoalService.deleteSavingsGoal(id, user);
        return ResponseEntity.ok(new MessageResponse("Savings goal deleted successfully"));
    }
}
