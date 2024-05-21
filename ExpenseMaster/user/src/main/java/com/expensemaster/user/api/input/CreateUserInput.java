package com.expensemaster.user.api.input;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CreateUserInput(
        @JsonProperty("email") String email,
        @JsonProperty("password") String password,
        @JsonProperty("userType") String userType
) {}
