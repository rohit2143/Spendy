package com.rohitcodes.expense_tracker.repository;

import com.rohitcodes.expense_tracker.entity.Transaction;
import com.rohitcodes.expense_tracker.entity.TransactionType;
import com.rohitcodes.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Transaction> findTop5ByUserOrderByTransactionDateDescIdDesc(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    boolean existsByExternalMessageId(String externalMessageId);

    List<Transaction> findByUserOrderByTransactionDateDescIdDesc(User user);

    List<Transaction> findByUserAndTypeOrderByTransactionDateDescIdDesc(
            User user,
            TransactionType type
    );
}
