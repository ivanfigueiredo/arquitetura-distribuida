package com.expensemaster.core.configuration;

import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.UserService;
import com.expensemaster.core.queue.Command;
import com.expensemaster.core.SpanAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class UserServiceConfig {
    private final Command command;

    public UserServiceConfig(
            final Command command
    ) {
        this.command = Objects.requireNonNull(command);
    }

    @Bean
    public IUserService createUserService(final SpanAdapter userSpan) {
        return new UserService(command, userSpan);
    }
}
