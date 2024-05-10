package com.expensemaster.application.user;

import com.expensemaster.application.IApplicationSpan;
import com.expensemaster.application.user.Queue.ICommand;
import com.expensemaster.application.user.dto.CreateUserDto;

import java.util.Objects;

public class UserService implements IUserService {
    private final ICommand command;

    private final IApplicationSpan userSpan;

    public UserService(
            final ICommand command,
            final IApplicationSpan userSpan
    ) {
        this.command = Objects.requireNonNull(command);
        this.userSpan = Objects.requireNonNull(userSpan);
    }
    @Override
    public void createUser(final CreateUserDto dto) {
        final var exchange = "user.events";
        final var routingKey = "user.created";
        this.userSpan.startSpan("application.create.user", () -> this.command.<CreateUserDto>sendCommand(exchange, routingKey, dto));
    }
}
