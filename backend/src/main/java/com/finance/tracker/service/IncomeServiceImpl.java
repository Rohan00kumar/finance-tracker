package com.finance.tracker.service;

import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class IncomeServiceImpl implements IncomeService {
    private final IncomeRepository incomeRepository;

    public IncomeServiceImpl(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    @Override
    public List<Income> getAllIncomes(User user) {
        return incomeRepository.findByUserOrderByDateDesc(user);
    }

    @Override
    public Income getIncomeById(Long id, User user) {
        return incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found or unauthorized"));
    }

    @Override
    public Income createIncome(Income income, User user) {
        income.setUser(user);
        return incomeRepository.save(income);
    }

    @Override
    public Income updateIncome(Long id, Income incomeDetails, User user) {
        Income income = getIncomeById(id, user);
        income.setTitle(incomeDetails.getTitle());
        income.setAmount(incomeDetails.getAmount());
        income.setDate(incomeDetails.getDate());
        income.setCategory(incomeDetails.getCategory());
        return incomeRepository.save(income);
    }

    @Override
    public void deleteIncome(Long id, User user) {
        Income income = getIncomeById(id, user);
        incomeRepository.delete(income);
    }

    @Override
    public List<Income> getIncomesBetween(User user, LocalDate start, LocalDate end) {
        return incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
    }
}
