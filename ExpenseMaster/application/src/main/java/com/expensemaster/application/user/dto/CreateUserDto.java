package com.expensemaster.application.user.dto;

import java.io.Serial;
import java.io.Serializable;

public class CreateUserDto {
    final String name;
    final String email;
    final String password;
    final String birthdate;
    final BudgetDto budget;

    public CreateUserDto(
            final String name,
            final String email,
            final String password,
            final String birthdate,
            final int totalLimit,
            final String startDate
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.budget = new BudgetDto(totalLimit, startDate);
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public BudgetDto getBudget() {
        return budget;
    }
}
