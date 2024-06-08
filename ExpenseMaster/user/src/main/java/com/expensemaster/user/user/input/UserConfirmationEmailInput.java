package com.expensemaster.user.user.input;

import com.expensemaster.application.user.dto.ConfirmationEmailDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public record UserConfirmationEmailInput(
        @JsonProperty("email") String email,
        @JsonProperty("code") String code
) {
    @Override
    public String toString() {
        return String.format("UserConfirmationEmailInput(email: %s, code: %s)",email,code);
    }

    public ConfirmationEmailDto toDto() {
        return new ConfirmationEmailDto(email, code);
    }
}
