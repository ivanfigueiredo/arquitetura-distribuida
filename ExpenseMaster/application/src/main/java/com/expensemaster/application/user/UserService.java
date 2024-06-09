package com.expensemaster.application.user;

import com.expensemaster.application.user.dto.ConfirmationEmailDto;
import com.expensemaster.application.user.dto.CreateUserDto;

import java.util.Objects;

public class UserService implements IUserService {
    private final ICreateUserGateway createUserGateway;

    public UserService(final ICreateUserGateway createUserGateway) {
        this.createUserGateway = Objects.requireNonNull(createUserGateway);
    }
    @Override
    public UserCreatedDto createUser(final CreateUserDto dto) {
        return this.createUserGateway.createUser(dto);
    }

    @Override
    public void confirmationEmail(ConfirmationEmailDto dto) {
        this.createUserGateway.confirmationEmail(dto);
    }
}
