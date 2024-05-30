package com.expensemaster.core.configuration;

import com.expensemaster.application.user.ICreateUserGateway;
import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.UserService;
import com.expensemaster.core.SpanAdapter;
import com.expensemaster.user.user.CreateUserGateway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
