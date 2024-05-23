package com.expensemaster.core;

import com.expensemaster.user.exceptions.InternalServerErrorException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

public class HeaderPropagationInterceptor implements ClientHttpRequestInterceptor {
    private final HttpServletRequest httpServletRequest;

    public HeaderPropagationInterceptor(final HttpServletRequest httpServletRequest) {
        this.httpServletRequest = Objects.requireNonNull(httpServletRequest);
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) {
        final var traceparent = httpServletRequest.getHeader("traceparent");
        final var correlationId = httpServletRequest.getHeader("x-correlation-id");
        request.getHeaders().add("traceparent", traceparent);
        request.getHeaders().add("correlationId", correlationId);

        try {
            return execution.execute(request, body);
        } catch (IOException e) {
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support");
        }
    }
}
