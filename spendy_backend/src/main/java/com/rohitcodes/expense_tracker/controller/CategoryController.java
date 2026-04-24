package com.rohitcodes.expense_tracker.controller;

import com.rohitcodes.expense_tracker.dto.category.CategoryRequest;
import com.rohitcodes.expense_tracker.dto.category.CategoryResponse;
import com.rohitcodes.expense_tracker.entity.CategoryType;
import com.rohitcodes.expense_tracker.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("#userId == authentication.principal.id")
    public CategoryResponse createCategory(
            @PathVariable Long userId,
            @Valid @RequestBody CategoryRequest request
    ) {
        return categoryService.createCategory(userId, request);
    }

    @GetMapping
    @PreAuthorize("#userId == authentication.principal.id")
    public List<CategoryResponse> getCategories(
            @PathVariable Long userId,
            @RequestParam(required = false) CategoryType type
    ) {
        return categoryService.getCategories(userId, type);
    }

    @GetMapping("/{categoryId}")
    @PreAuthorize("#userId == authentication.principal.id")
    public CategoryResponse getCategoryById(
            @PathVariable Long userId,
            @PathVariable Long categoryId
    ) {
        return categoryService.getCategoryById(userId, categoryId);
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("#userId == authentication.principal.id")
    public CategoryResponse updateCategory(
            @PathVariable Long userId,
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryRequest request
    ) {
        return categoryService.updateCategory(userId, categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("#userId == authentication.principal.id")
    public void deleteCategory(
            @PathVariable Long userId,
            @PathVariable Long categoryId
    ) {
        categoryService.deleteCategory(userId, categoryId);
    }
}