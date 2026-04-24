package com.rohitcodes.expense_tracker.mapper;

import com.rohitcodes.expense_tracker.entity.Budget;
import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.dto.budget.BudgetRequest;
import com.rohitcodes.expense_tracker.dto.budget.BudgetResponse;
import org.springframework.stereotype.Component;

@Component
public class BudgetMapper {

    public Budget toEntity(BudgetRequest request, User user, Category category) {
        Budget budget = new Budget();
        updateEntity(budget, request, user, category);
        return budget;
    }

    public void updateEntity(Budget budget, BudgetRequest request, User user, Category category) {
        budget.setUser(user);
        budget.setCategory(category);
        budget.setLimitAmount(request.getLimitAmount());
        budget.setBudgetYear(request.getBudgetYear());
        budget.setBudgetMonth(request.getBudgetMonth());
    }

    public BudgetResponse toResponse(Budget budget) {
        BudgetResponse response = new BudgetResponse();
        response.setId(budget.getId());
        response.setUserId(budget.getUser().getId());
        response.setCategoryId(budget.getCategory().getId());
        response.setCategoryName(budget.getCategory().getName());
        response.setCategoryType(budget.getCategory().getType());
        response.setLimitAmount(budget.getLimitAmount());
        response.setBudgetYear(budget.getBudgetYear());
        response.setBudgetMonth(budget.getBudgetMonth());
        return response;
    }
}