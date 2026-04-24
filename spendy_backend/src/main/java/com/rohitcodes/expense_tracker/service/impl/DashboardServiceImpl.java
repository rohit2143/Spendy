package com.rohitcodes.expense_tracker.service.impl;

import com.rohitcodes.expense_tracker.entity.Budget;
import com.rohitcodes.expense_tracker.entity.Transaction;
import com.rohitcodes.expense_tracker.entity.TransactionType;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.repository.BudgetRepository;
import com.rohitcodes.expense_tracker.repository.TransactionRepository;
import com.rohitcodes.expense_tracker.repository.UserRepository;
import com.rohitcodes.expense_tracker.dto.dashboard.SummaryResponse;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionResponse;
import com.rohitcodes.expense_tracker.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public DashboardServiceImpl(
            UserRepository userRepository,
            TransactionRepository transactionRepository,
            BudgetRepository budgetRepository
    ) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public SummaryResponse getMonthlySummary(Long userId, Integer year, Integer month) {
        if (month == null || month < 1 || month > 12) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Month must be between 1 and 12");
        }

        User user = getUserById(userId);
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Transaction> transactions = transactionRepository
                .findByUserAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(user, startDate, endDate);
        List<Budget> budgets = budgetRepository.findByUserAndBudgetYearAndBudgetMonth(user, year, month);

        BigDecimal totalIncome = sumTransactionsByType(transactions, TransactionType.INCOME);
        BigDecimal totalExpense = sumTransactionsByType(transactions, TransactionType.EXPENSE);
        BigDecimal totalBudget = budgets.stream()
                .map(Budget::getLimitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        SummaryResponse response = new SummaryResponse();
        response.setYear(year);
        response.setMonth(month);
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(totalIncome.subtract(totalExpense));
        response.setTotalBudget(totalBudget);
        response.setRemainingBudget(totalBudget.subtract(totalExpense));
        response.setTransactionCount((long) transactions.size());
        return response;
    }

    @Override
    public List<TransactionResponse> getRecentTransactions(Long userId) {
        User user = getUserById(userId);
        return transactionRepository.findTop5ByUserOrderByTransactionDateDescIdDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    private BigDecimal sumTransactionsByType(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(transaction -> transaction.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private TransactionResponse toResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setUserId(transaction.getUser().getId());
        response.setCategoryId(transaction.getCategory().getId());
        response.setCategoryName(transaction.getCategory().getName());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setSource(transaction.getSource());
        response.setImportStatus(transaction.getImportStatus());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setDescription(transaction.getDescription());
        response.setMerchant(transaction.getMerchant());
        response.setExternalMessageId(transaction.getExternalMessageId());
        response.setRawMessage(transaction.getRawMessage());
        response.setCreatedAt(transaction.getCreatedAt());
        return response;
    }
}