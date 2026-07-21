package com.finance.tracker.service;

import com.finance.tracker.entity.SavingsGoal;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.SavingsGoalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class SavingsGoalServiceImpl implements SavingsGoalService {
    private final SavingsGoalRepository savingsGoalRepository;

    public SavingsGoalServiceImpl(SavingsGoalRepository savingsGoalRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
    }

    @Override
    public List<SavingsGoal> getAllSavingsGoals(User user) {
        return savingsGoalRepository.findByUser(user);
    }

    @Override
    public SavingsGoal getSavingsGoalById(Long id, User user) {
        return savingsGoalRepository.findById(id)
                .filter(sg -> sg.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found or unauthorized"));
    }

    @Override
    public SavingsGoal createSavingsGoal(SavingsGoal savingsGoal, User user) {
        savingsGoal.setUser(user);
        return savingsGoalRepository.save(savingsGoal);
    }

    @Override
    public SavingsGoal updateSavingsGoal(Long id, SavingsGoal details, User user) {
        SavingsGoal sg = getSavingsGoalById(id, user);
        sg.setTitle(details.getTitle());
        sg.setTargetAmount(details.getTargetAmount());
        sg.setCurrentAmount(details.getCurrentAmount());
        sg.setTargetDate(details.getTargetDate());
        return savingsGoalRepository.save(sg);
    }

    @Override
    public void deleteSavingsGoal(Long id, User user) {
        SavingsGoal sg = getSavingsGoalById(id, user);
        savingsGoalRepository.delete(sg);
    }
}
