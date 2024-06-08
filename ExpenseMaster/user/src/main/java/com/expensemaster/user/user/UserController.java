package com.expensemaster.user.user;

import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.UserCreatedDto;
import com.expensemaster.application.user.dto.CreateUserDto;
import com.expensemaster.user.IUserSpan;
import com.expensemaster.user.template.Template;
import com.expensemaster.user.user.input.CreateUserInput;
import com.expensemaster.user.user.input.UserConfirmationEmailInput;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@RestController
public class UserController implements IUserAPI {
    private final IUserService userService;

    private final IUserSpan userSpan;

    public UserController(
            final IUserService userService,
            final IUserSpan userSpan
    ) {
        this.userService = Objects.requireNonNull(userService);
        this.userSpan = Objects.requireNonNull(userSpan);
    }

    @Override
    public ResponseEntity<UserCreatedDto> createUser(final HttpServletRequest request, final CreateUserInput input) {
        this.userSpan.setHttpRequest(request);
        final var dto = new CreateUserDto(input.email(), input.password(), input.userType());
        AtomicReference<UserCreatedDto> output = new AtomicReference<UserCreatedDto>();
        this.userSpan.startSpan("userController.create.user", () -> {
           output.set(userService.createUser(dto));
        });

        return new ResponseEntity<>(output.get(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> activate(final HttpServletRequest request, final UserConfirmationEmailInput input) {
        this.userSpan.setHttpRequest(request);
        final var dto = input.toDto();
        this.userSpan.startSpan("userController.confirmation.email", () -> {
            userService.confirmationEmail(dto);
        });
        return new ResponseEntity<>(Template.confirmedEmail(), HttpStatus.OK);
    }
}
