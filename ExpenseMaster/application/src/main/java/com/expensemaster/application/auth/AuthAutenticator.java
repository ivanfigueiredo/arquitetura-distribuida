package com.expensemaster.application.auth;

import java.util.Objects;

public class AuthAutenticator implements IAuthAutenticator {
    private final IAuthGateway authGateway;

    public AuthAutenticator(final IAuthGateway authGateway) {
        this.authGateway = Objects.requireNonNull(authGateway);
    }

    @Override
    public AuthOutputDto execute(AuthDto dto) {
        return this.authGateway.auth(dto);
    }
}
