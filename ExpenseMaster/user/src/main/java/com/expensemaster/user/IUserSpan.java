package com.expensemaster.user;

import com.expensemaster.application.ICallback;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.amqp.core.MessageProperties;

public interface IUserSpan {
    public void setHttpRequest(final HttpServletRequest request);
    public void startSpan(final String spanName, ICallback function);
    public MessageProperties contextPropagation();
}
