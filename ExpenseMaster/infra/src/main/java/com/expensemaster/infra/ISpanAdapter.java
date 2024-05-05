package com.expensemaster.infra;

import com.expensemaster.application.ICallback;
import jakarta.servlet.http.HttpServletRequest;

public interface ISpanAdapter {
    public void setHttpRequest(final HttpServletRequest request);
    public void startSpan(final String spanName, ICallback function);
}
