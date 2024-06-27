package com.expensemaster.core;

import com.expensemaster.user.exceptions.InternalServerErrorException;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.propagation.TextMapSetter;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;

public class HeaderPropagationInterceptor implements ClientHttpRequestInterceptor {

    public HeaderPropagationInterceptor() {}

    private static final TextMapSetter<HttpRequest> setter = (carrier, key, value) -> {
        if (carrier != null) {
            carrier.getHeaders().set(key, value);
        }
    };

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) {
        Context currentContext = Context.current();
        W3CTraceContextPropagator.getInstance().inject(currentContext, request, setter);
        try {
            return execution.execute(request, body);
        } catch (IOException e) {
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support");
        }
    }
}
