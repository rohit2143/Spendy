package com.rohitcodes.expense_tracker.service;

import com.rohitcodes.expense_tracker.dto.budget.BudgetRequest;
import com.rohitcodes.expense_tracker.dto.budget.BudgetResponse;

import java.util.List;

public interface BudgetService {

    BudgetResponse createBudget(Long userId, BudgetRequest request);

    List<BudgetResponse> getBudgets(Long userId, Integer budgetYear, Integer budgetMonth);

    BudgetResponse getBudgetById(Long userId, Long budgetId);

    BudgetResponse updateBudget(Long userId, Long budgetId, BudgetRequest request);

    void deleteBudget(Long userId, Long budgetId);
}