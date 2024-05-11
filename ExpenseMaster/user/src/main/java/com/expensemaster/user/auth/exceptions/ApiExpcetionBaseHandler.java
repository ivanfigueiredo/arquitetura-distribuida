package com.expensemaster.user.auth.exceptions;

public interface ApiExpcetionBaseHandler {
    ApiExpcetionBaseHandler next = null;

    public ApiExceptionBaseOutputDto handle(NoStacktraceException e);
}
