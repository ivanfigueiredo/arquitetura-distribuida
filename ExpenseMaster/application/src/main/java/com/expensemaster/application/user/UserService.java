package com.expensemaster.application.user;

import com.expensemaster.application.IApplicationSpan;
import com.expensemaster.application.user.dto.CreateUserDto;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

public class UserService implements IUserService {
    private final ICreateUserGateway createUserGateway;

    private final IApplicationSpan userSpan;

    public UserService(
            final ICreateUserGateway createUserGateway,
            final IApplicationSpan userSpan
    ) {
        this.createUserGateway = Objects.requireNonNull(createUserGateway);
        this.userSpan = Objects.requireNonNull(userSpan);
    }
    @Override
    public UserCreatedDto createUser(final CreateUserDto dto) {
        AtomicReference<UserCreatedDto> output = new AtomicReference<UserCreatedDto>();
        this.userSpan.startSpan("application.create.user", () -> {
           output.set(this.createUserGateway.createUser(dto));
        });

        return output.get();
    }
}
