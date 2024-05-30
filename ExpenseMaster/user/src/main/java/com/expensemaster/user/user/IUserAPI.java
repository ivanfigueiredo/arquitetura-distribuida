package com.expensemaster.user.user;

import com.expensemaster.application.user.UserCreatedDto;
import com.expensemaster.user.user.input.CreateUserInput;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "users")
public interface IUserAPI {
    @PostMapping(
            value = "signup",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<UserCreatedDto> createUser(final HttpServletRequest request, @RequestBody final CreateUserInput input);
}
