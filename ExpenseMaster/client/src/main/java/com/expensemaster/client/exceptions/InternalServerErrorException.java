package com.expensemaster.client.exceptions;

public class InternalServerErrorException extends NoStacktraceException {
    public InternalServerErrorException(final String eMessage) {
        super(eMessage);
    }
}
