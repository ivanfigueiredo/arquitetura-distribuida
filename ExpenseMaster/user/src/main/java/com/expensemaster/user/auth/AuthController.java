package com.expensemaster.user.auth;

import com.expensemaster.application.auth.AuthDto;
import com.expensemaster.application.auth.AuthOutputDto;
import com.expensemaster.application.auth.IAuthAutenticator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
public class AuthController implements IAuthAPI {

    private final IAuthAutenticator authAuthenticator;

    public AuthController(final IAuthAutenticator authAuthenticator) {
        this.authAuthenticator = Objects.requireNonNull(authAuthenticator);
    }

    @Override
    public ResponseEntity<AuthOutputDto> auth(final HttpServletRequest request, final AuthInput input) {
        final var dto = new AuthDto(input.email(), input.password());
        final var output = this.authAuthenticator.execute(dto);

        return new ResponseEntity<>(output, HttpStatus.OK);
    }
}
