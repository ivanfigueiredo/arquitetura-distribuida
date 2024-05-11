package com.expensemaster.application.auth;

public interface IAuthAutenticator {
    public AuthOutputDto execute(AuthDto dto);
}
