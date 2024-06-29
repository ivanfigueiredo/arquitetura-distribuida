package com.expensemaster.client.exceptions;

public interface ApiExpcetionBaseHandler {
    ApiExpcetionBaseHandler next = null;

    public ApiExceptionBaseOutputDto handle(NoStacktraceException e);
}
