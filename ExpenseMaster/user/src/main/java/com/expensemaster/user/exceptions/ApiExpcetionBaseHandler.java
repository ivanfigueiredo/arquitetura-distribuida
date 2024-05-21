package com.expensemaster.user.exceptions;

public interface ApiExpcetionBaseHandler {
    ApiExpcetionBaseHandler next = null;

    public ApiExceptionBaseOutputDto handle(NoStacktraceException e);
}
