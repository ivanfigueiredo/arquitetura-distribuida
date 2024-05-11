package com.expensemaster.user.auth;

import com.expensemaster.application.auth.AuthDto;
import com.expensemaster.application.auth.AuthOutputDto;
import com.expensemaster.application.auth.IAuthGateway;
import com.expensemaster.user.auth.exceptions.InternalServerErrorException;
import com.expensemaster.user.auth.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
public class AuthGateway implements IAuthGateway {

    @Value("${user.auth.hostname}")
    private String hostname;

    private final RestTemplate restTemplate;

    public AuthGateway() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public AuthOutputDto auth(AuthDto dto) {
        try {
            return this.restTemplate.postForObject(this.hostname + "/auth", dto, AuthOutputDto.class);
        } catch (RestClientException e) {
            final var error = "500 Internal Server Error: \"{\"message\":\"Email or password invalid\"}\"";
            if (e.getMessage().contentEquals(error)) {
                final var message = e.getMessage().split(": ")[1].split(":")[1].split("}")[0];
                throw new UnauthorizedException(message);
            }
            throw new InternalServerErrorException(e.getMessage());
        }
    }
}
