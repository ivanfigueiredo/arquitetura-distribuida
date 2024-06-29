package com.expensemaster.client;

import com.expensemaster.application.ICallback;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.http.client.ClientHttpRequestInterceptor;

import java.util.List;

public interface IClientSpan {
    public void setHttpRequest(final HttpServletRequest request);

    public void startSpan(final String spanName, ICallback function);

    public void startSpanWithContext(final String spanName, ICallback function);

    public MessageProperties contextPropagationQueue();

    public List<ClientHttpRequestInterceptor> contextPropagationApi();
}
