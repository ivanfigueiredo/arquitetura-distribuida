package com.expensemaster.core;

import com.expensemaster.application.ICallback;
import com.expensemaster.application.IApplicationSpan;
import com.expensemaster.user.IUserSpan;
import io.opentelemetry.api.logs.LogRecordBuilder;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import io.opentelemetry.context.propagation.TextMapPropagator;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
public class SpanAdapter implements IApplicationSpan, IUserSpan, ISpanAdapter {
    private static final Logger LOGGER = LoggerFactory.getLogger(SpanAdapter.class);
    private final Tracer tracer;
    private final TextMapPropagator textMapPropagator;

    private final LogRecordBuilder logRecordBuilder;
    private HttpServletRequest request;

    public SpanAdapter(
            final Tracer tracer,
            final TextMapPropagator textMapPropagator,
            final LogRecordBuilder logRecordBuilder
            ) {
        this.logRecordBuilder = Objects.requireNonNull(logRecordBuilder);
        this.tracer = Objects.requireNonNull(tracer);
        this.textMapPropagator = Objects.requireNonNull(textMapPropagator);
    }

    private String getCorrelationId() {
        return this.request.getHeader("x-correlation-id");
    }

    private Context makeContext() {
        return textMapPropagator.extract(Context.current(), request, new HeaderGetter());
    }

    @Override
    public void startSpan(final String spanName, ICallback function) {
        final var contextResult = this.makeContext();
        final var span = tracer.spanBuilder(spanName)
                .setParent(contextResult)
                .setAttribute("correlationId", getCorrelationId())
                .setSpanKind(SpanKind.SERVER)
                .startSpan();
        try(Scope scope = span.makeCurrent()) {
            try {
                logRecordBuilder.setContext(contextResult).emit();
                function.apply();
            } catch (Exception e) {
              span.recordException(e);
              throw e;
            } finally {
                span.end(Instant.now());
            }
        }
    }

    @Override
    public MessageProperties contextPropagationQueue() {
        final var messageProperties = new MessageProperties();
        final var context = this.makeContext();
        messageProperties.setHeader("correlationId", getCorrelationId());

        this.textMapPropagator.inject(context, messageProperties.getHeaders(), (carrier, key, value) -> {
            carrier.put(key, value);
        });

        return messageProperties;
    }

    @Override
    public List<ClientHttpRequestInterceptor> contextPropagationApi() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new HeaderPropagationInterceptor(this.request));
        return interceptors;
    }

    @Override
    public void setHttpRequest(final HttpServletRequest request) {
        this.request = request;
    }
}
