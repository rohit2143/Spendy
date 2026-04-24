package com.rohitcodes.expense_tracker.service.impl;

import com.rohitcodes.expense_tracker.entity.Budget;
import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.CategoryType;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.repository.BudgetRepository;
import com.rohitcodes.expense_tracker.repository.CategoryRepository;
import com.rohitcodes.expense_tracker.repository.UserRepository;
import com.rohitcodes.expense_tracker.dto.budget.BudgetRequest;
import com.rohitcodes.expense_tracker.dto.budget.BudgetResponse;
import com.rohitcodes.expense_tracker.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public BudgetServiceImpl(
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository
    ) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public BudgetResponse createBudget(Long userId, BudgetRequest request) {
        User user = getUserById(userId);
        Category category = getExpenseCategoryByIdAndUser(request.getCategoryId(), user);
        validateDuplicateBudget(user, category, request, null);

        Budget budget = new Budget();
        applyRequest(budget, request, user, category);

        return toResponse(budgetRepository.save(budget));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(Long userId, Integer budgetYear, Integer budgetMonth) {
        User user = getUserById(userId);

        List<Budget> budgets;
        if (budgetYear == null && budgetMonth == null) {
            budgets = budgetRepository.findByUserOrderByBudgetYearDescBudgetMonthDescIdDesc(user);
        } else {
            if (budgetYear == null || budgetMonth == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Both budgetYear and budgetMonth are required");
            }
            budgets = budgetRepository.findByUserAndBudgetYearAndBudgetMonth(user, budgetYear, budgetMonth);
        }

        return budgets.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(Long userId, Long budgetId) {
        User user = getUserById(userId);
        return toResponse(getBudgetByIdAndUser(budgetId, user));
    }

    @Override
    public BudgetResponse updateBudget(Long userId, Long budgetId, BudgetRequest request) {
        User user = getUserById(userId);
        Budget budget = getBudgetByIdAndUser(budgetId, user);
        Category category = getExpenseCategoryByIdAndUser(request.getCategoryId(), user);
        validateDuplicateBudget(user, category, request, budget.getId());

        applyRequest(budget, request, user, category);

        return toResponse(budgetRepository.save(budget));
    }

    @Override
    public void deleteBudget(Long userId, Long budgetId) {
        User user = getUserById(userId);
        budgetRepository.delete(getBudgetByIdAndUser(budgetId, user));
    }

    private void applyRequest(Budget budget, BudgetRequest request, User user, Category category) {
        budget.setUser(user);
        budget.setCategory(category);
        budget.setLimitAmount(request.getLimitAmount());
        budget.setBudgetYear(request.getBudgetYear());
        budget.setBudgetMonth(request.getBudgetMonth());
    }

    private void validateDuplicateBudget(User user, Category category, BudgetRequest request, Long currentBudgetId) {
        budgetRepository.findByUserAndCategoryAndBudgetYearAndBudgetMonth(
                        user,
                        category,
                        request.getBudgetYear(),
                        request.getBudgetMonth()
                )
                .filter(existingBudget -> !existingBudget.getId().equals(currentBudgetId))
                .ifPresent(existingBudget -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Budget already exists for this category and month");
                });
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Category getExpenseCategoryByIdAndUser(Long categoryId, User user) {
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        if (category.getType() != CategoryType.EXPENSE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Budget can only be created for expense categories");
        }

        return category;
    }

    private Budget getBudgetByIdAndUser(Long budgetId, User user) {
        return budgetRepository.findByIdAndUser(budgetId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Budget not found"));
    }

    private BudgetResponse toResponse(Budget budget) {
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
