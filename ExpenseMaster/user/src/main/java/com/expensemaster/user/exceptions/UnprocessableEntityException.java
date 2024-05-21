package com.expensemaster.user.exceptions;

public class UnprocessableEntityException extends NoStacktraceException {
    public UnprocessableEntityException(String message) {
        super(message);
    }
}
