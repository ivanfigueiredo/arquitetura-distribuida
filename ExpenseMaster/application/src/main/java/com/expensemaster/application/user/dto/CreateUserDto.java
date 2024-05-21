package com.expensemaster.application.user.dto;

import java.io.Serial;
import java.io.Serializable;

public class CreateUserDto {
    final String email;
    final String password;

    final String userType;

    public CreateUserDto(
            final String email,
            final String password,
            final String userType
    ) {
        this.email = email;
        this.password = password;
        this.userType = userType;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUserType() {
        return userType;
    }
}
