package com.expensemaster.application.auth;

public record AuthDto(
        String email,
        String password
) {}
