package com.expensemaster.infra.user;

import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.dto.CreateUserDto;
import com.expensemaster.infra.ISpanAdapter;
import com.expensemaster.infra.user.input.CreateUserInput;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
public class UserController implements IUserAPI {
    private final IUserService userService;

    private final ISpanAdapter spanAdapter;

    public UserController(
            final IUserService userService,
            final ISpanAdapter spanAdapter
    ) {
        this.userService = Objects.requireNonNull(userService);
        this.spanAdapter = Objects.requireNonNull(spanAdapter);
    }

    @Override
    public void createUser(final HttpServletRequest request, final CreateUserInput input) {
        this.spanAdapter.setHttpRequest(request);
        final var dto = new CreateUserDto(
                input.name(),
                input.email(),
                input.password(),
                input.birthdate(),
                input.totalLimit(),
                input.startDate());
        this.spanAdapter.startSpan("userController.user.createuser", () -> userService.createUser(dto));
    }
}
