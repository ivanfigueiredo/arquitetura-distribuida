package com.expensemaster.core;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;
import java.util.Objects;

public class HeaderPropagationInterceptor implements ClientHttpRequestInterceptor {
    private final HttpServletRequest httpServletRequest;

    public HeaderPropagationInterceptor(final HttpServletRequest httpServletRequest) {
        this.httpServletRequest = Objects.requireNonNull(httpServletRequest);
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        final var traceparent = httpServletRequest.getHeader("traceparent");
        final var correlationId = httpServletRequest.getHeader("correlationId");

        request.getHeaders().add("traceparent", traceparent);
        request.getHeaders().add("correlationId", correlationId);

        return execution.execute(request, body);
    }
}
