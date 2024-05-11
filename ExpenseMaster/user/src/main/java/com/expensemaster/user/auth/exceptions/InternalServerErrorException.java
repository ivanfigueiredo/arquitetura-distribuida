package com.expensemaster.user.auth.exceptions;

public class InternalServerErrorException extends NoStacktraceException {
    public InternalServerErrorException(final String eMessage) {
        super(eMessage);
    }
}
