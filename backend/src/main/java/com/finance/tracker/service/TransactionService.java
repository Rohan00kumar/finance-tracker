package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {
    List<TransactionResponse> getAllTransactions(User user);
    TransactionResponse getTransactionById(Long id, User user);
    TransactionResponse createTransaction(TransactionRequest request, User user);
    TransactionResponse updateTransaction(Long id, TransactionRequest request, User user);
    void deleteTransaction(Long id, User user);
    List<Transaction> getTransactionsBetweenDates(User user, LocalDate startDate, LocalDate endDate);
}
