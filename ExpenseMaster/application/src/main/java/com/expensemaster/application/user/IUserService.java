package com.expensemaster.application.user;

import com.expensemaster.application.user.dto.CreateUserDto;

public interface IUserService {
    public UserCreatedDto createUser(final CreateUserDto dto);
}
