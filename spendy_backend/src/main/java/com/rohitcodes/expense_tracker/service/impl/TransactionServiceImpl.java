package com.rohitcodes.expense_tracker.service.impl;

import com.rohitcodes.expense_tracker.dto.transaction.TransactionRequest;
import com.rohitcodes.expense_tracker.dto.transaction.TransactionResponse;
import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.Transaction;
import com.rohitcodes.expense_tracker.entity.TransactionType;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.repository.CategoryRepository;
import com.rohitcodes.expense_tracker.repository.TransactionRepository;
import com.rohitcodes.expense_tracker.repository.UserRepository;
import com.rohitcodes.expense_tracker.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        User user = getUserById(userId);
        Category category = getCategoryByIdAndUser(request.getCategoryId(), user);

        validateExternalMessageId(request.getExternalMessageId(), null);

        Transaction transaction = new Transaction();
        applyRequest(transaction, request, user, category);

        return toResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactions(
            Long userId,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate
    ) {
        User user = getUserById(userId);
        List<Transaction> transactions;

        if (startDate != null || endDate != null) {
            if (startDate == null || endDate == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Both startDate and endDate are required"
                );
            }

            if (startDate.isAfter(endDate)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "startDate must be before or equal to endDate"
                );
            }

            transactions =
                    transactionRepository.findByUserAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(
                            user,
                            startDate,
                            endDate
                    );

            if (type != null) {
                transactions = transactions.stream()
                        .filter(t -> t.getType() == type)
                        .toList();
            }

        } else if (type != null) {
            transactions =
                    transactionRepository.findByUserAndTypeOrderByTransactionDateDescIdDesc(user, type);

        } else {
            transactions =
                    transactionRepository.findByUserOrderByTransactionDateDescIdDesc(user);
        }

        return transactions.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getRecentTransactions(Long userId) {
        User user = getUserById(userId);

        return transactionRepository.findTop5ByUserOrderByTransactionDateDescIdDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long userId, Long transactionId) {
        User user = getUserById(userId);
        return toResponse(getTransactionByIdAndUser(transactionId, user));
    }

    @Override
    public TransactionResponse updateTransaction(
            Long userId,
            Long transactionId,
            TransactionRequest request
    ) {
        User user = getUserById(userId);
        Transaction transaction = getTransactionByIdAndUser(transactionId, user);
        Category category = getCategoryByIdAndUser(request.getCategoryId(), user);

        validateExternalMessageId(
                request.getExternalMessageId(),
                transaction.getExternalMessageId()
        );

        applyRequest(transaction, request, user, category);

        return toResponse(transactionRepository.save(transaction));
    }

    @Override
    public void deleteTransaction(Long userId, Long transactionId) {
        User user = getUserById(userId);
        transactionRepository.delete(getTransactionByIdAndUser(transactionId, user));
    }

    private void applyRequest(
            Transaction transaction,
            TransactionRequest request,
            User user,
            Category category
    ) {
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

    private void validateExternalMessageId(
            String newExternalMessageId,
            String currentExternalMessageId
    ) {
        String normalizedExternalMessageId =
                normalizeNullableText(newExternalMessageId);

        if (normalizedExternalMessageId == null) {
            return;
        }

        if (normalizedExternalMessageId.equals(currentExternalMessageId)) {
            return;
        }

        if (transactionRepository.existsByExternalMessageId(normalizedExternalMessageId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "External message id already exists"
            );
        }
    }

    private String normalizeNullableText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Category getCategoryByIdAndUser(Long categoryId, User user) {
        return categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private Transaction getTransactionByIdAndUser(Long transactionId, User user) {
        return transactionRepository.findByIdAndUser(transactionId, user)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
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