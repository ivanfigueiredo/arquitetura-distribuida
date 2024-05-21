package com.expensemaster.user.exceptions;

public class InternalServerErrorException extends NoStacktraceException {
    public InternalServerErrorException(final String eMessage) {
        super(eMessage);
    }
}
