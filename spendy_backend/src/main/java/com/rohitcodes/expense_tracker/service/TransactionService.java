package com.rohitcodes.expense_tracker.service;

import com.rohitcodes.expense_tracker.dto.transaction.TransactionRequest;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionResponse;
import com.rohitcodes.expense_tracker.entity.TransactionType;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {

    TransactionResponse createTransaction(Long userId, TransactionRequest request);

    List<TransactionResponse> getTransactions(
            Long userId,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate
    );
    List<TransactionResponse> getRecentTransactions(Long userId);

    TransactionResponse getTransactionById(Long userId, Long transactionId);

    TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionRequest request);

    void deleteTransaction(Long userId, Long transactionId);
}