package com.rohitcodes.expense_tracker.controller;

import com.rohitcodes.expense_tracker.dto.dashboard.SummaryResponse;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionResponse;
import com.rohitcodes.expense_tracker.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @PreAuthorize("#userId == authentication.principal.id")
    public SummaryResponse getMonthlySummary(
            @PathVariable Long userId,
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {
        return dashboardService.getMonthlySummary(userId, year, month);
    }

    @GetMapping("/recent-transactions")
    @PreAuthorize("#userId == authentication.principal.id")
    public List<TransactionResponse> getRecentTransactions(
            @PathVariable Long userId
    ) {
        return dashboardService.getRecentTransactions(userId);
    }
}