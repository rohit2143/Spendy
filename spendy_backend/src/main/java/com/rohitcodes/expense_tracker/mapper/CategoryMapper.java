package com.rohitcodes.expense_tracker.mapper;

import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.dto.category.CategoryRequest;
import com.rohitcodes.expense_tracker.dto.category.CategoryResponse;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequest request, User user) {
        Category category = new Category();
        updateEntity(category, request, user);
        return category;
    }

    public void updateEntity(Category category, CategoryRequest request, User user) {
        category.setUser(user);
        category.setName(request.getName().trim());
        category.setType(request.getType());
    }

    public CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setType(category.getType());
        response.setUserId(category.getUser().getId());
        return response;
    }
}