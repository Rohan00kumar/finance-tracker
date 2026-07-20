package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<TransactionResponse> getAllTransactions(User user) {
        return transactionRepository.findByUserOrderByDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionResponse getTransactionById(Long id, User user) {
        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or unauthorized"));
        return mapToResponse(transaction);
    }

    @Override
    public TransactionResponse createTransaction(TransactionRequest request, User user) {
        Transaction transaction = new Transaction(
                user,
                request.getDescription(),
                request.getAmount(),
                request.getType(),
                request.getDate(),
                request.getCategory()
        );
        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Override
    public TransactionResponse updateTransaction(Long id, TransactionRequest request, User user) {
        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or unauthorized"));

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setCategory(request.getCategory());

        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Override
    public void deleteTransaction(Long id, User user) {
        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or unauthorized"));
        transactionRepository.delete(transaction);
    }

    @Override
    public List<Transaction> getTransactionsBetweenDates(User user, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDate(),
                transaction.getCategory()
        );
    }
}
