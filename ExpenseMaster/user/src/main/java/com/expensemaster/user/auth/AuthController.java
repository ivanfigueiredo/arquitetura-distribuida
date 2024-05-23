package com.expensemaster.user.auth;

import com.expensemaster.application.auth.AuthDto;
import com.expensemaster.application.auth.AuthOutputDto;
import com.expensemaster.application.auth.IAuthAutenticator;
import com.expensemaster.user.IUserSpan;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@RestController
public class AuthController implements IAuthAPI {

    private final IAuthAutenticator authAuthenticator;

    private final IUserSpan userSpan;

    public AuthController(
            final IAuthAutenticator authAuthenticator,
            final IUserSpan userSpan
    ) {
        this.authAuthenticator = Objects.requireNonNull(authAuthenticator);
        this.userSpan = Objects.requireNonNull(userSpan);
    }

    @Override
    public ResponseEntity<AuthOutputDto> auth(final HttpServletRequest request, final AuthInput input) {
        this.userSpan.setHttpRequest(request);
        final var dto = new AuthDto(input.email(), input.password());
        AtomicReference<AuthOutputDto> output = new AtomicReference<AuthOutputDto>();
        this.userSpan.startSpan("authcontroller.auth", () -> output.set(authAuthenticator.execute(dto)));

        return new ResponseEntity<>(output.get(), HttpStatus.OK);
    }
}
