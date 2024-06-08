package com.expensemaster.user.user;

import com.expensemaster.application.user.UserCreatedDto;
import com.expensemaster.user.user.input.CreateUserInput;
import com.expensemaster.user.user.input.UserConfirmationEmailInput;
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

    @PostMapping(
            value = "activate",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.TEXT_HTML_VALUE
    )
    public ResponseEntity<String> activate(final HttpServletRequest request, @RequestBody final UserConfirmationEmailInput input);

}
