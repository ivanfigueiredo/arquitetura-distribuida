package com.expensemaster.user.user.input;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserConfirmationEmailInput(
        @JsonProperty("email") String email
) {}
