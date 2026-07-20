package com.finance.tracker.controller;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.security.UserDetailsImpl;
import com.finance.tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public TransactionController(TransactionService transactionService, UserRepository userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(transactionService.getAllTransactions(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(transactionService.getTransactionById(id, user));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(transactionService.createTransaction(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(transactionService.updateTransaction(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        transactionService.deleteTransaction(id, user);
        return ResponseEntity.ok().build();
    }
}
