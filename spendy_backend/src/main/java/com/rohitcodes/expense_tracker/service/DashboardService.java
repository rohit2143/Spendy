package com.rohitcodes.expense_tracker.service;

import com.rohitcodes.expense_tracker.dto.dashboard.SummaryResponse;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionResponse;

import java.util.List;

public interface DashboardService {

    SummaryResponse getMonthlySummary(Long userId, Integer year, Integer month);

    List<TransactionResponse> getRecentTransactions(Long userId);
}