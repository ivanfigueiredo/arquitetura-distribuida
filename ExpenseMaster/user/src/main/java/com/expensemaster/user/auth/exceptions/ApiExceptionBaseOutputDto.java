package com.expensemaster.user.auth.exceptions;

import org.springframework.http.HttpStatus;

public class ApiExceptionBaseOutputDto {
    public final ApiException apiException;
    public final HttpStatus httpStatus;

    public ApiExceptionBaseOutputDto(final ApiException apiException, final HttpStatus httpStatus) {
        this.apiException = apiException;
        this.httpStatus = httpStatus;
    }
}
