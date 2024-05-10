package com.expensemaster.user.api;

import com.expensemaster.user.api.input.CreateUserInput;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
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
    public void createUser(final HttpServletRequest request, @RequestBody final CreateUserInput input);
}
