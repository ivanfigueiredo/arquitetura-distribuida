package com.expensemaster.core.configuration;

import com.expensemaster.application.auth.AuthAutenticator;
import com.expensemaster.application.auth.IAuthAutenticator;
import com.expensemaster.application.auth.IAuthGateway;
import com.expensemaster.core.SpanAdapter;
import com.expensemaster.user.auth.AuthGateway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthConfiguration {

    @Bean
    public IAuthGateway createAuthGateway(final SpanAdapter spanAdapter) {
        return new AuthGateway(spanAdapter);
    }

    @Bean
    public IAuthAutenticator resolve(final AuthGateway authGateway) {
        return new AuthAutenticator(authGateway);
    }
}
