package com.finance.tracker.service;

import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.User;
import java.time.LocalDate;
import java.util.List;

public interface IncomeService {
    List<Income> getAllIncomes(User user);
    Income getIncomeById(Long id, User user);
    Income createIncome(Income income, User user);
    Income updateIncome(Long id, Income income, User user);
    void deleteIncome(Long id, User user);
    List<Income> getIncomesBetween(User user, LocalDate start, LocalDate end);
}
