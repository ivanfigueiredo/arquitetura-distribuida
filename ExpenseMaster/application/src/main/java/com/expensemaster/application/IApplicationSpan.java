package com.expensemaster.application;

public interface IApplicationSpan {
    public void startSpan(final String spanName, ICallback function);
}
