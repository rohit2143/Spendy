package com.rohitcodes.expense_tracker.service;

import com.rohitcodes.expense_tracker.dto.auth.AuthResponse;
import com.rohitcodes.expense_tracker.dto.auth.LoginRequest;
import com.rohitcodes.expense_tracker.dto.auth.RegisterRequest;
import org.springframework.context.annotation.Bean;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}