package com.expensemaster.user.auth.exceptions;

public class UnauthorizedException extends NoStacktraceException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
