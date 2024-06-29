package com.expensemaster.client.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ClientApiExceptionHandler {
    private final ApiExpcetionBaseHandler apiExpcetionBaseHandler;

    public ClientApiExceptionHandler() {
        this.apiExpcetionBaseHandler = new InternalServerErrorExceptionHandler();
    }

    @ExceptionHandler(value = {NoStacktraceException.class})
    public ResponseEntity<Object> handleApiException(NoStacktraceException e) {
        final var output = this.apiExpcetionBaseHandler.handle(e);
        return new ResponseEntity<>(output.apiException, output.httpStatus);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
}
