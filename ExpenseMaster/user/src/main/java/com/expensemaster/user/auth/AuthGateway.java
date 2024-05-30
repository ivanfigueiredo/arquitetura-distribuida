package com.expensemaster.user.auth;

import com.expensemaster.application.auth.AuthDto;
import com.expensemaster.application.auth.AuthOutputDto;
import com.expensemaster.application.auth.IAuthGateway;
import com.expensemaster.user.IUserSpan;
import com.expensemaster.user.exceptions.InternalServerErrorException;
import com.expensemaster.user.exceptions.UnauthorizedException;
import com.expensemaster.user.exceptions.UnprocessableEntityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
public class AuthGateway implements IAuthGateway {

    @Value("${user.auth.hostname}")
    private String hostname;

    private final RestTemplate restTemplate;

    private final IUserSpan userSpan;

    public AuthGateway(final IUserSpan userSpan) {
        this.restTemplate = new RestTemplate();
        this.userSpan = Objects.requireNonNull(userSpan);
    }

    @Override
    public AuthOutputDto auth(AuthDto dto) {
        try {
            final var interceptors = this.userSpan.contextPropagationApi();
            restTemplate.setInterceptors(interceptors);
            return this.restTemplate.postForObject(this.hostname + "/auth", dto, AuthOutputDto.class);
        } catch (RestClientException e) {
            if (e.getMessage().contains("401")) {
                throw new UnauthorizedException("Email or password invalid");
            }
            if (e.getMessage().contains("Email has not been verified.")) {
                throw new UnprocessableEntityException("Email has not been verified.");
            }
            throw new InternalServerErrorException(e.getMessage());
        }
    }
}
