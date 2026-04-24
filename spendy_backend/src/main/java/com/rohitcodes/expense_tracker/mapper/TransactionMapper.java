package com.rohitcodes.expense_tracker.mapper;

import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.Transaction;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionRequest;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionResponse;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public Transaction toEntity(TransactionRequest request, User user, Category category) {
        Transaction transaction = new Transaction();
        updateEntity(transaction, request, user, category);
        return transaction;
    }

    public void updateEntity(Transaction transaction, TransactionRequest request, User user, Category category) {
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setSource(request.getSource());
        transaction.setImportStatus(request.getImportStatus());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription().trim());
        transaction.setMerchant(normalizeNullableText(request.getMerchant()));
        transaction.setExternalMessageId(normalizeNullableText(request.getExternalMessageId()));
        transaction.setRawMessage(normalizeNullableText(request.getRawMessage()));
    }

    public TransactionResponse toResponse(Transaction transaction) {
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

    private String normalizeNullableText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}