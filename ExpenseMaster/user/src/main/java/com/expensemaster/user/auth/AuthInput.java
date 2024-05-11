package com.expensemaster.user.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthInput(
        @JsonProperty("email") String email,
        @JsonProperty("password") String password
) {}
