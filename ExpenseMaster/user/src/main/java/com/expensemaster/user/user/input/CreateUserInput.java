package com.expensemaster.user.user.input;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CreateUserInput(
        @JsonProperty("email") String email,
        @JsonProperty("password") String password,
        @JsonProperty("userType") String userType
) {}
