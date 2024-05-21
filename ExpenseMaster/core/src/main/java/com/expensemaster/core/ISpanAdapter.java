package com.expensemaster.core;

import com.expensemaster.application.ICallback;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.http.client.ClientHttpRequestInterceptor;

import java.util.List;
import java.util.Map;

public interface ISpanAdapter {
    public void setHttpRequest(final HttpServletRequest request);

    public void startSpan(final String spanName, ICallback function);

    public MessageProperties contextPropagationQueue();

    public List<ClientHttpRequestInterceptor> contextPropagationApi();
}
