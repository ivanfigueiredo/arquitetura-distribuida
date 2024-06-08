package com.expensemaster.user.user;

import com.expensemaster.application.user.ICreateUserGateway;
import com.expensemaster.application.user.UserCreatedDto;
import com.expensemaster.application.user.dto.ConfirmationEmailDto;
import com.expensemaster.application.user.dto.CreateUserDto;
import com.expensemaster.user.IUserSpan;
import com.expensemaster.user.exceptions.InternalServerErrorException;
import com.expensemaster.user.exceptions.UnprocessableEntityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
public class CreateUserGateway implements ICreateUserGateway {

    @Value("${user.create-user.hostname}")
    private String createUserHost;

    @Value("${user.confirmation-email.hostname}")
    private String confirmationEmailHost;

    private final RestTemplate restTemplate;
    private final IUserSpan userSpan;

    public CreateUserGateway(final IUserSpan userSpan) {
        this.restTemplate = new RestTemplate();
        this.userSpan = Objects.requireNonNull(userSpan);
    }

    @Override
    public UserCreatedDto createUser(CreateUserDto dto) {
        try {
            final var interceptors = this.userSpan.contextPropagationApi();
            restTemplate.setInterceptors(interceptors);
            return this.restTemplate.postForObject(this.createUserHost + "/create-user", dto, UserCreatedDto.class);
        } catch (RestClientException e) {
            final var error = "A senha não é válida. Ela deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial.";
            if (e.getMessage().contains(error)) {
                throw new UnprocessableEntityException(error);
            }
            throw new InternalServerErrorException(e.getMessage());
        }
    }

    @Override
    public void confirmationEmail(ConfirmationEmailDto dto) {
        try {
            final var interceptors = this.userSpan.contextPropagationApi();
            restTemplate.setInterceptors(interceptors);
            this.restTemplate.postForLocation(this.confirmationEmailHost + "/verify", dto);
        } catch (RestClientException e) {
            System.out.println("===> ERROR" + e.getMessage());
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support");
        }
    }
}
