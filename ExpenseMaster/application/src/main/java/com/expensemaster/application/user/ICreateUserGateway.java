package com.expensemaster.application.user;

import com.expensemaster.application.user.dto.CreateUserDto;

public interface ICreateUserGateway {
    public UserCreatedDto createUser(CreateUserDto dto);
}
