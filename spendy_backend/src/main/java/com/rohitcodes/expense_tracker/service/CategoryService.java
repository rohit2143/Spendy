package com.rohitcodes.expense_tracker.service;

import com.rohitcodes.expense_tracker.entity.CategoryType;
import com.rohitcodes.expense_tracker.dto.category.CategoryRequest;
import com.rohitcodes.expense_tracker.dto.category.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(Long userId, CategoryRequest request);

    List<CategoryResponse> getCategories(Long userId, CategoryType type);

    CategoryResponse getCategoryById(Long userId, Long categoryId);

    CategoryResponse updateCategory(Long userId, Long categoryId, CategoryRequest request);

    void deleteCategory(Long userId, Long categoryId);
}