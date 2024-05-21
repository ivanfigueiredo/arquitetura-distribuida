package com.expensemaster.user.auth.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {
    private final ApiExpcetionBaseHandler apiExpcetionBaseHandler;

    public ApiExceptionHandler() {
        final var internalServerErrorHandler = new InternalServerErrorExceptionHandler();
        this.apiExpcetionBaseHandler = new UnauthorizedExceptionHandler(internalServerErrorHandler);
    }

    @ExceptionHandler(value = {NoStacktraceException.class})
    public ResponseEntity<Object> handleApiException(NoStacktraceException e) {
        final var output = this.apiExpcetionBaseHandler.handle(e);
        return new ResponseEntity<>(output.apiException, output.httpStatus);
    }
}
