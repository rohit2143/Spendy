package com.rohitcodes.expense_tracker.service.impl;

import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.CategoryType;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.repository.CategoryRepository;
import com.rohitcodes.expense_tracker.repository.UserRepository;
import com.rohitcodes.expense_tracker.dto.category.CategoryRequest;
import com.rohitcodes.expense_tracker.dto.category.CategoryResponse;
import com.rohitcodes.expense_tracker.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CategoryResponse createCategory(Long userId, CategoryRequest request) {
        User user = getUserById(userId);
        validateDuplicateCategory(user, request.getName(), null);

        Category category = new Category();
        category.setUser(user);
        category.setName(request.getName().trim());
        category.setType(request.getType());

        return toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(Long userId, CategoryType type) {
        User user = getUserById(userId);

        List<Category> categories = type == null
                ? categoryRepository.findByUserOrderByNameAsc(user)
                : categoryRepository.findByUserAndTypeOrderByNameAsc(user, type);

        return categories.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long userId, Long categoryId) {
        User user = getUserById(userId);
        return toResponse(getCategoryByIdAndUser(categoryId, user));
    }

    @Override
    public CategoryResponse updateCategory(Long userId, Long categoryId, CategoryRequest request) {
        User user = getUserById(userId);
        Category category = getCategoryByIdAndUser(categoryId, user);

        validateDuplicateCategory(user, request.getName(), category.getId());

        category.setName(request.getName().trim());
        category.setType(request.getType());

        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long userId, Long categoryId) {
        User user = getUserById(userId);
        Category category = getCategoryByIdAndUser(categoryId, user);
        categoryRepository.delete(category);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Category getCategoryByIdAndUser(Long categoryId, User user) {
        return categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private void validateDuplicateCategory(User user, String name, Long currentCategoryId) {
        categoryRepository.findByUserAndNameIgnoreCase(user, name.trim())
                .filter(existingCategory -> !existingCategory.getId().equals(currentCategoryId))
                .ifPresent(existingCategory -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already exists");
                });
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setType(category.getType());
        response.setUserId(category.getUser().getId());
        return response;
    }
}