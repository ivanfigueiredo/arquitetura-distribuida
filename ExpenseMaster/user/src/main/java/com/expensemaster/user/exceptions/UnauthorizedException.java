package com.expensemaster.user.exceptions;

public class UnauthorizedException extends NoStacktraceException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
