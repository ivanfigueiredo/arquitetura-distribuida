package com.expensemaster.application.user;

import com.expensemaster.application.user.dto.CreateUserDto;

public interface IUserService {
    public void createUser(final CreateUserDto dto);
}
