package com.expensemaster.user.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {
    private final ApiExpcetionBaseHandler apiExpcetionBaseHandler;

    public ApiExceptionHandler() {
        final var internalServerErrorHandler = new InternalServerErrorExceptionHandler();
        final var unauthorizedExceptionHandler = new UnauthorizedExceptionHandler(internalServerErrorHandler);
        this.apiExpcetionBaseHandler = new UnprocessableEntityExceptionHandler(unauthorizedExceptionHandler);
    }

    @ExceptionHandler(value = {NoStacktraceException.class})
    public ResponseEntity<Object> handleApiException(NoStacktraceException e) {
        final var output = this.apiExpcetionBaseHandler.handle(e);
        return new ResponseEntity<>(output.apiException, output.httpStatus);
    }
}
