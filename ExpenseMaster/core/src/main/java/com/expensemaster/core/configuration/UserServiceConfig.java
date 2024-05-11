package com.expensemaster.core.configuration;

import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.Queue.ICommand;
import com.expensemaster.application.user.UserService;
import com.expensemaster.core.queue.Command;
import com.expensemaster.core.SpanAdapter;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class UserServiceConfig {

    @Bean
    public ICommand createCommand(final RabbitTemplate rabbitTemplate, final SpanAdapter spanAdapter) {
        return new Command(rabbitTemplate, spanAdapter);
    }

    @Bean
    public IUserService createUserService(final Command command, final SpanAdapter userSpan) {
        return new UserService(command, userSpan);
    }
}
