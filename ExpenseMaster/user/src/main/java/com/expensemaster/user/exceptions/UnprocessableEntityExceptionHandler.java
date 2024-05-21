package com.expensemaster.user.exceptions;

import org.springframework.http.HttpStatus;

import java.time.ZoneId;
import java.time.ZonedDateTime;

public class UnprocessableEntityExceptionHandler implements ApiExpcetionBaseHandler {
    private ApiExpcetionBaseHandler next = null;

    public UnprocessableEntityExceptionHandler(final ApiExpcetionBaseHandler next) {
        this.next = next;
    }

    public UnprocessableEntityExceptionHandler() {}

    @Override
    public ApiExceptionBaseOutputDto handle(NoStacktraceException e) {
        if (e instanceof UnprocessableEntityException) {
            HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
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
