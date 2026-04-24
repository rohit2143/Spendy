package com.rohitcodes.expense_tracker.repository;

import com.rohitcodes.expense_tracker.entity.Budget;
import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndBudgetYearAndBudgetMonth(User user, Integer budgetYear, Integer budgetMonth);

    List<Budget> findByUserOrderByBudgetYearDescBudgetMonthDescIdDesc(User user);

    Optional<Budget> findByIdAndUser(Long id, User user);

    Optional<Budget> findByUserAndCategoryAndBudgetYearAndBudgetMonth(
            User user,
            Category category,
            Integer budgetYear,
            Integer budgetMonth
    );

}
