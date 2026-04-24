package com.rohitcodes.expense_tracker.repository;


import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.CategoryType;
import com.rohitcodes.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserOrderByNameAsc(User user);
    Optional<Category> findByIdAndUser(Long id, User user);
    Optional<Category> findByUserAndNameIgnoreCase(User user, String name);
    List<Category> findByUserAndTypeOrderByNameAsc(User user, CategoryType type);
}