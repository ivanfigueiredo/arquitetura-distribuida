package com.expensemaster.user.auth.exceptions;

import org.springframework.http.HttpStatus;

import java.time.ZoneId;
import java.time.ZonedDateTime;

public class UnauthorizedExceptionHandler implements ApiExpcetionBaseHandler {
    private ApiExpcetionBaseHandler next = null;

    public UnauthorizedExceptionHandler(final ApiExpcetionBaseHandler next) {
        this.next = next;
    }

    public UnauthorizedExceptionHandler() {}

    @Override
    public ApiExceptionBaseOutputDto handle(NoStacktraceException e) {
        if (e instanceof UnauthorizedException) {
            HttpStatus status = HttpStatus.UNAUTHORIZED;
            ApiException apiException = new ApiException(
                    e.getMessage(),
                    e,
                    status,
                    ZonedDateTime.now(ZoneId.of("Z"))
            );
            return new ApiExceptionBaseOutputDto(apiException, status);
        }
        return this.next.handle(e);
    }
}
