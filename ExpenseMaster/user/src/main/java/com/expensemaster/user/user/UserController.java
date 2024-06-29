package com.expensemaster.user.user;

import com.expensemaster.application.user.IUserService;
import com.expensemaster.application.user.UserCreatedDto;
import com.expensemaster.application.user.dto.CreateUserDto;
import com.expensemaster.user.IUserSpan;
import com.expensemaster.user.template.Template;
import com.expensemaster.user.user.input.CreateUserInput;
import com.expensemaster.user.user.input.UserConfirmationEmailInput;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@RestController
public class UserController implements IUserAPI {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final IUserService userService;

    private final IUserSpan span;

    public UserController(
            final IUserService userService,
            final IUserSpan span
    ) {
        this.userService = Objects.requireNonNull(userService);
        this.span = Objects.requireNonNull(span);
    }

    @Override
    public ResponseEntity<UserCreatedDto> createUser(final HttpServletRequest request, final CreateUserInput input) {
        this.span.setHttpRequest(request);
        final var dto = new CreateUserDto(input.email(), input.password(), input.userType());
        AtomicReference<UserCreatedDto> output = new AtomicReference<UserCreatedDto>();
        this.span.startSpan("bus.receive.from.kong", () -> {
            logger.info("Recebendo requisicao HTTP para criacao de usuario");
            output.set(userService.createUser(dto));
        });
        return new ResponseEntity<>(output.get(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> activate(final HttpServletRequest request, final UserConfirmationEmailInput input) {
        this.span.setHttpRequest(request);
        final var dto = input.toDto();
        this.span.startSpan("bus.receive.from.kong", () -> {
            logger.info("Recebendo requisicao HTTP para confirmacao do E-mail");
            userService.confirmationEmail(dto);
        });
        return new ResponseEntity<>(Template.confirmedEmail(), HttpStatus.OK);
    }
}
