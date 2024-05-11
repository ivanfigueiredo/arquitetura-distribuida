package com.expensemaster.application.auth;

public interface IAuthGateway {
    public AuthOutputDto auth(AuthDto dto);
}
