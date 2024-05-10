package com.expensemaster.user.api;

import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.dto.CreateUserDto;
import com.expensemaster.user.IUserSpan;
import com.expensemaster.user.api.input.CreateUserInput;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

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
    public void createUser(final HttpServletRequest request, final CreateUserInput input) {
        this.userSpan.setHttpRequest(request);
        final var dto = new CreateUserDto(
                input.name(),
                input.email(),
                input.password(),
                input.birthdate(),
                input.totalLimit(),
                input.startDate());
        this.userSpan.startSpan("userController.create.user", () -> userService.createUser(dto));
    }
}
