package com.expensemaster.core.configuration;

import com.expensemaster.application.user.ICreateUserGateway;
import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.Queue.ICommand;
import com.expensemaster.application.user.UserService;
import com.expensemaster.core.queue.Command;
import com.expensemaster.core.SpanAdapter;
import com.expensemaster.user.api.CreateUserGateway;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class UserServiceConfig {

    @Bean
    public ICreateUserGateway resolveCreateUserGateway(final SpanAdapter spanAdapter) {
        return new CreateUserGateway(spanAdapter);
    }
//    @Bean
//    public ICommand createCommand(final RabbitTemplate rabbitTemplate, final SpanAdapter spanAdapter) {
//        return new Command(rabbitTemplate, spanAdapter);
//    }

    @Bean
    public IUserService createUserService(final CreateUserGateway createUserGateway, final SpanAdapter userSpan) {
        return new UserService(createUserGateway, userSpan);
    }
}
