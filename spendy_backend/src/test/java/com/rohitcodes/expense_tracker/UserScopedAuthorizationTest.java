package com.rohitcodes.expense_tracker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rohitcodes.expense_tracker.entity.Category;
import com.rohitcodes.expense_tracker.entity.CategoryType;
import com.rohitcodes.expense_tracker.entity.User;
import com.rohitcodes.expense_tracker.repository.BudgetRepository;
import com.rohitcodes.expense_tracker.repository.CategoryRepository;
import com.rohitcodes.expense_tracker.repository.TransactionRepository;
import com.rohitcodes.expense_tracker.repository.UserRepository;
import com.rohitcodes.expense_tracker.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = ExpenseTrackerApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserScopedAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private JwtService jwtService;

    private User owner;
    private User otherUser;
    private String ownerToken;

    @BeforeEach
    void setUp() {
        budgetRepository.deleteAll();
        transactionRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        owner = createUser("Owner", "owner@example.com");
        otherUser = createUser("Other", "other@example.com");
        ownerToken = jwtService.generateToken(owner);

        Category category = new Category();
        category.setName("Food");
        category.setType(CategoryType.EXPENSE);
        category.setUser(owner);
        categoryRepository.save(category);
    }

    @Test
    void registerAndLoginReturnNormalizedUserDataAndJwt() throws Exception {
        JsonNode registeredUser = registerUser("Alice", "Alice@Example.com", "secret123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "email", "alice@example.com",
                                "password", "secret123"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(registeredUser.get("userId").asLong()))
                .andExpect(jsonPath("$.name").value("Alice"))
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.token").isString());
    }

    @Test
    void rejectsDuplicateRegistrationEvenWithDifferentEmailCase() throws Exception {
        registerUser("Alice", "alice@example.com", "secret123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", "Another Alice",
                                "email", "ALICE@example.com",
                                "password", "secret123"
                        ))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    void allowsRequestsForAuthenticatedUsersOwnPathId() throws Exception {
        mockMvc.perform(get("/api/users/{userId}/categories", owner.getId())
                        .header("Authorization", bearer(ownerToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Food"))
                .andExpect(jsonPath("$[0].userId").value(owner.getId()));
    }

    @Test
    void rejectsRequestsForAnotherUsersPathId() throws Exception {
        mockMvc.perform(get("/api/users/{userId}/categories", otherUser.getId())
                        .header("Authorization", bearer(ownerToken)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void categoryCrudAndValidationWorkForAuthenticatedUser() throws Exception {
        AuthSession session = registerAndAuthenticate("Alice", "alice@example.com", "secret123");

        JsonNode createdCategory = createCategory(session, " Food ", "EXPENSE");
        long categoryId = createdCategory.get("id").asLong();

        mockMvc.perform(get("/api/users/{userId}/categories", session.userId())
                        .header("Authorization", bearer(session.token())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Food"))
                .andExpect(jsonPath("$[0].type").value("EXPENSE"));

        mockMvc.perform(put("/api/users/{userId}/categories/{categoryId}", session.userId(), categoryId)
                        .header("Authorization", bearer(session.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", "Utilities",
                                "type", "EXPENSE"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Utilities"));

        mockMvc.perform(post("/api/users/{userId}/categories", session.userId())
                        .header("Authorization", bearer(session.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", " ",
                                "type", "EXPENSE"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));

        mockMvc.perform(delete("/api/users/{userId}/categories/{categoryId}", session.userId(), categoryId)
                        .header("Authorization", bearer(session.token())))
                .andExpect(status().isNoContent());
    }

    @Test
    void transactionBudgetAndDashboardEndpointsReturnExpectedSummary() throws Exception {
        AuthSession session = registerAndAuthenticate("Alice", "alice@example.com", "secret123");

        long expenseCategoryId = createCategory(session, "Food", "EXPENSE").get("id").asLong();
        long incomeCategoryId = createCategory(session, "Salary", "INCOME").get("id").asLong();

        mockMvc.perform(post("/api/users/{userId}/budgets", session.userId())
                        .header("Authorization", bearer(session.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "categoryId", expenseCategoryId,
                                "limitAmount", "500.00",
                                "budgetYear", 2026,
                                "budgetMonth", 4
                        ))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/users/{userId}/transactions", session.userId())
                        .header("Authorization", bearer(session.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(transactionRequest(
                                expenseCategoryId,
                                "120.50",
                                "EXPENSE",
                                "Lunch",
                                "2026-04-10"
                        ))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/users/{userId}/transactions", session.userId())
                        .header("Authorization", bearer(session.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(transactionRequest(
                                incomeCategoryId,
                                "1000.00",
                                "INCOME",
                                "Salary credit",
                                "2026-04-11"
                        ))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/users/{userId}/dashboard/summary", session.userId())
                        .header("Authorization", bearer(session.token()))
                        .param("year", "2026")
                        .param("month", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionCount").value(2));
    }

    private AuthSession registerAndAuthenticate(String name, String email, String password) throws Exception {
        JsonNode registeredUser = registerUser(name, email, password);
        return new AuthSession(
                registeredUser.get("userId").asLong(),
                registeredUser.get("token").asText()
        );
    }

    private JsonNode registerUser(String name, String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", name,
                                "email", email,
                                "password", password
                        ))))
                .andExpect(status().isCreated())
                .andReturn();

        return readJson(result);
    }

    private JsonNode createCategory(AuthSession session, String name, String type) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/users/{userId}/categories", session.userId())
                        .header("Authorization", bearer(session.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", name,
                                "type", type
                        ))))
                .andExpect(status().isCreated())
                .andReturn();

        return readJson(result);
    }

    private Map<String, Object> transactionRequest(
            long categoryId,
            String amount,
            String type,
            String description,
            String transactionDate
    ) {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("categoryId", categoryId);
        request.put("amount", amount);
        request.put("type", type);
        request.put("source", "MANUAL");
        request.put("importStatus", "CONFIRMED");
        request.put("transactionDate", transactionDate);
        request.put("description", description);
        request.put("merchant", "Local Store");
        request.put("externalMessageId", null);
        request.put("rawMessage", null);
        return request;
    }

    private JsonNode readJson(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private User createUser(String name, String email) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword("encoded-password");
        return userRepository.save(user);
    }

    private record AuthSession(long userId, String token) {
    }
}