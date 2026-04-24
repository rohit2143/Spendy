package com.rohitcodes.expense_tracker.controller;

import com.rohitcodes.expense_tracker.dto.budget.BudgetRequest;
import com.rohitcodes.expense_tracker.dto.budget.BudgetResponse;
import com.rohitcodes.expense_tracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("#userId == authentication.principal.id")
    public BudgetResponse createBudget(
            @PathVariable Long userId,
            @Valid @RequestBody BudgetRequest request
    ) {
        return budgetService.createBudget(userId, request);
    }

    @GetMapping
    @PreAuthorize("#userId == authentication.principal.id")
    public List<BudgetResponse> getBudgets(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer budgetYear,
            @RequestParam(required = false) Integer budgetMonth
    ) {
        return budgetService.getBudgets(userId, budgetYear, budgetMonth);
    }

    @GetMapping("/{budgetId}")
    @PreAuthorize("#userId == authentication.principal.id")
    public BudgetResponse getBudgetById(
            @PathVariable Long userId,
            @PathVariable Long budgetId
    ) {
        return budgetService.getBudgetById(userId, budgetId);
    }

    @PutMapping("/{budgetId}")
    @PreAuthorize("#userId == authentication.principal.id")
    public BudgetResponse updateBudget(
            @PathVariable Long userId,
            @PathVariable Long budgetId,
            @Valid @RequestBody BudgetRequest request
    ) {
        return budgetService.updateBudget(userId, budgetId, request);
    }

    @DeleteMapping("/{budgetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("#userId == authentication.principal.id")
    public void deleteBudget(
            @PathVariable Long userId,
            @PathVariable Long budgetId
    ) {
        budgetService.deleteBudget(userId, budgetId);
    }
}