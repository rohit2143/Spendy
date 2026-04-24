package com.rohitcodes.expense_tracker.controller;

import com.rohitcodes.expense_tracker.dto.transaction.TransactionRequest;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionResponse;
import com.rohitcodes.expense_tracker.entity.TransactionType;
import com.rohitcodes.expense_tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("#userId == authentication.principal.id")
    public TransactionResponse createTransaction(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return transactionService.createTransaction(userId, request);
    }

    @GetMapping
    @PreAuthorize("#userId == authentication.principal.id")
    public List<TransactionResponse> getTransactions(
            @PathVariable Long userId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return transactionService.getTransactions(userId, type, startDate, endDate);
    }

    @GetMapping("/recent")
    @PreAuthorize("#userId == authentication.principal.id")
    public List<TransactionResponse> getRecentTransactions(
            @PathVariable Long userId
    ) {
        return transactionService.getRecentTransactions(userId);
    }

    @GetMapping("/{transactionId}")
    @PreAuthorize("#userId == authentication.principal.id")
    public TransactionResponse getTransactionById(
            @PathVariable Long userId,
            @PathVariable Long transactionId
    ) {
        return transactionService.getTransactionById(userId, transactionId);
    }

    @PutMapping("/{transactionId}")
    @PreAuthorize("#userId == authentication.principal.id")
    public TransactionResponse updateTransaction(
            @PathVariable Long userId,
            @PathVariable Long transactionId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return transactionService.updateTransaction(userId, transactionId, request);
    }

    @DeleteMapping("/{transactionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("#userId == authentication.principal.id")
    public void deleteTransaction(
            @PathVariable Long userId,
            @PathVariable Long transactionId
    ) {
        transactionService.deleteTransaction(userId, transactionId);
    }
}