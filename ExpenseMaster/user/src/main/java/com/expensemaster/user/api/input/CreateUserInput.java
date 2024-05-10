package com.expensemaster.user.api.input;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CreateUserInput(
        @JsonProperty("name") String name,
        @JsonProperty("email") String email,
        @JsonProperty("password") String password,
        @JsonProperty("birthdate") String birthdate,
        @JsonProperty("totalLimit") int totalLimit,
        @JsonProperty("startDate") String startDate
) {}
