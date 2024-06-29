package com.expensemaster.client.exceptions;

import org.springframework.http.HttpStatus;

import java.time.ZoneId;
import java.time.ZonedDateTime;

public class InternalServerErrorExceptionHandler implements ApiExpcetionBaseHandler {
    private ApiExpcetionBaseHandler next = null;

    public InternalServerErrorExceptionHandler(final ApiExpcetionBaseHandler next) {
        this.next = next;
    }

    public InternalServerErrorExceptionHandler() {}


    @Override
    public ApiExceptionBaseOutputDto handle(NoStacktraceException e) {
        if (e instanceof InternalServerErrorException) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            ApiException apiException = new ApiException(
                    e.getMessage(),
                    e,
                    status,
                    ZonedDateTime.now(ZoneId.of("Z"))
            );
            return new ApiExceptionBaseOutputDto(apiException, status);
        }
        if (this.next == null) throw e;
        return this.next.handle(e);
    }
}
