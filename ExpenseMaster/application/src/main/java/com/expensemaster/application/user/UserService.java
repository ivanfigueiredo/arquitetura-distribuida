package com.expensemaster.application.user;

import com.expensemaster.application.user.dto.ConfirmationEmailDto;
import com.expensemaster.application.user.dto.CreateUserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;

public class UserService implements IUserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final ICreateUserGateway createUserGateway;

    public UserService(final ICreateUserGateway createUserGateway) {
        this.createUserGateway = Objects.requireNonNull(createUserGateway);
    }
    @Override
    public UserCreatedDto createUser(final CreateUserDto dto) {
        LOGGER.info("Chamando microsservico para criacao do usuario");
        final var output = this.createUserGateway.createUser(dto);
        LOGGER.info("Usuario criado com o ID: " + output.userId());
        return output;
    }

    @Override
    public void confirmationEmail(ConfirmationEmailDto dto) {
        LOGGER.info("Chamando microsserivo para confirmacao de E-mail");
        this.createUserGateway.confirmationEmail(dto);
    }
}
