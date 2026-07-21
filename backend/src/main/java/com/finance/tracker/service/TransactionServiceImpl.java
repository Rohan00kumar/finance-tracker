package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.dto.TransactionType;
import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public TransactionServiceImpl(IncomeRepository incomeRepository, ExpenseRepository expenseRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<TransactionResponse> getAllTransactions(User user) {
        List<Income> incomes = incomeRepository.findByUserOrderByDateDesc(user);
        List<Expense> expenses = expenseRepository.findByUserOrderByDateDesc(user);

        List<TransactionResponse> list = new ArrayList<>();
        for (Income i : incomes) {
            list.add(new TransactionResponse(i.getId(), i.getTitle(), i.getAmount(), TransactionType.INCOME, i.getDate(), i.getCategory()));
        }
        for (Expense e : expenses) {
            list.add(new TransactionResponse(e.getId(), e.getTitle(), e.getAmount(), TransactionType.EXPENSE, e.getDate(), e.getCategory()));
        }

        list.sort((t1, t2) -> t2.getDate().compareTo(t1.getDate()));
        return list;
    }

    @Override
    public TransactionResponse getTransactionById(Long id, User user) {
        Optional<Income> income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()));
        if (income.isPresent()) {
            Income i = income.get();
            return new TransactionResponse(i.getId(), i.getTitle(), i.getAmount(), TransactionType.INCOME, i.getDate(), i.getCategory());
        }

        Expense e = expenseRepository.findById(id)
                .filter(ex -> ex.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or unauthorized"));

        return new TransactionResponse(e.getId(), e.getTitle(), e.getAmount(), TransactionType.EXPENSE, e.getDate(), e.getCategory());
    }

    @Override
    public TransactionResponse createTransaction(TransactionRequest request, User user) {
        if (request.getType() == TransactionType.INCOME) {
            Income i = new Income(request.getDescription(), request.getAmount(), request.getDate(), request.getCategory(), user);
            Income saved = incomeRepository.save(i);
            return new TransactionResponse(saved.getId(), saved.getTitle(), saved.getAmount(), TransactionType.INCOME, saved.getDate(), saved.getCategory());
        } else {
            Expense e = new Expense(request.getDescription(), request.getAmount(), request.getDate(), request.getCategory(), user);
            Expense saved = expenseRepository.save(e);
            return new TransactionResponse(saved.getId(), saved.getTitle(), saved.getAmount(), TransactionType.EXPENSE, saved.getDate(), saved.getCategory());
        }
    }

    @Override
    public TransactionResponse updateTransaction(Long id, TransactionRequest request, User user) {
        // Try update Income first
        Optional<Income> existingIncome = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()));

        if (existingIncome.isPresent()) {
            Income i = existingIncome.get();
            if (request.getType() == TransactionType.EXPENSE) {
                // Type changed from Income to Expense
                incomeRepository.delete(i);
                Expense e = new Expense(request.getDescription(), request.getAmount(), request.getDate(), request.getCategory(), user);
                Expense saved = expenseRepository.save(e);
                return new TransactionResponse(saved.getId(), saved.getTitle(), saved.getAmount(), TransactionType.EXPENSE, saved.getDate(), saved.getCategory());
            } else {
                i.setTitle(request.getDescription());
                i.setAmount(request.getAmount());
                i.setDate(request.getDate());
                i.setCategory(request.getCategory());
                Income saved = incomeRepository.save(i);
                return new TransactionResponse(saved.getId(), saved.getTitle(), saved.getAmount(), TransactionType.INCOME, saved.getDate(), saved.getCategory());
            }
        }

        // Try update Expense
        Optional<Expense> existingExpense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()));

        if (existingExpense.isPresent()) {
            Expense e = existingExpense.get();
            if (request.getType() == TransactionType.INCOME) {
                // Type changed from Expense to Income
                expenseRepository.delete(e);
                Income i = new Income(request.getDescription(), request.getAmount(), request.getDate(), request.getCategory(), user);
                Income saved = incomeRepository.save(i);
                return new TransactionResponse(saved.getId(), saved.getTitle(), saved.getAmount(), TransactionType.INCOME, saved.getDate(), saved.getCategory());
            } else {
                e.setTitle(request.getDescription());
                e.setAmount(request.getAmount());
                e.setDate(request.getDate());
                e.setCategory(request.getCategory());
                Expense saved = expenseRepository.save(e);
                return new TransactionResponse(saved.getId(), saved.getTitle(), saved.getAmount(), TransactionType.EXPENSE, saved.getDate(), saved.getCategory());
            }
        }

        throw new ResourceNotFoundException("Transaction not found or unauthorized");
    }

    @Override
    public void deleteTransaction(Long id, User user) {
        Optional<Income> income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()));
        if (income.isPresent()) {
            incomeRepository.delete(income.get());
            return;
        }

        Expense e = expenseRepository.findById(id)
                .filter(ex -> ex.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or unauthorized"));
        expenseRepository.delete(e);
    }
}
