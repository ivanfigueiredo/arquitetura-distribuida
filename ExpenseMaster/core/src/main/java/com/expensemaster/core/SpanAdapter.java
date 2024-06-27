package com.expensemaster.core;

import com.expensemaster.application.ICallback;
import com.expensemaster.user.IUserSpan;
import io.opentelemetry.api.logs.LogRecordBuilder;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import io.opentelemetry.context.propagation.TextMapPropagator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
public class SpanAdapter implements IUserSpan, ISpanAdapter {
    private final Tracer tracer;
    private final TextMapPropagator textMapPropagator;
    private final LogRecordBuilder logRecordBuilder;
    private HttpServletRequest request;

    private Span span;

    public SpanAdapter(
            final Tracer tracer,
            final TextMapPropagator textMapPropagator,
            final LogRecordBuilder logRecordBuilder
            ) {
        this.logRecordBuilder = Objects.requireNonNull(logRecordBuilder);
        this.tracer = Objects.requireNonNull(tracer);
        this.textMapPropagator = Objects.requireNonNull(textMapPropagator);
    }

    private Context makeContext() {
        return textMapPropagator.extract(Context.current(), request, new HeaderGetter());
    }

    @Override
    public void startSpan(final String spanName, ICallback function) {
        final var contextResult = this.makeContext();
        this.span = tracer.spanBuilder(spanName)
                .setSpanKind(SpanKind.SERVER)
                .setParent(contextResult)
                .startSpan();
        final var currrentContext = Context.current().with(this.span);
        try (Scope scope = this.span.makeCurrent()) {
            try {
                logRecordBuilder.setContext(currrentContext).emit();
                function.apply();
            } catch (Exception e) {
                this.span.recordException(e);
                throw e;
            } finally {
                this.span.end(Instant.now());
            }
        }
    }

    @Override
    public void startSpanWithContext(String spanName, ICallback function) {
        final var clientSpan = tracer.spanBuilder(spanName)
                .setSpanKind(SpanKind.CLIENT)
                .setParent(Context.current().with(this.span))
                .startSpan();
        try (Scope scope = clientSpan.makeCurrent()) {
            try {
                function.apply();
            } catch (Exception e) {
                clientSpan.recordException(e);
                throw e;
            } finally {
                clientSpan.end(Instant.now());
            }
        }
    }

    @Override
    public MessageProperties contextPropagationQueue() {
        final var messageProperties = new MessageProperties();
        final var context = Context.current().with(this.span);

        this.textMapPropagator.inject(context, messageProperties.getHeaders(), (carrier, key, value) -> {
            carrier.put(key, value);
        });

        return messageProperties;
    }

    @Override
    public List<ClientHttpRequestInterceptor> contextPropagationApi() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new HeaderPropagationInterceptor());
        return interceptors;
    }

    @Override
    public void setHttpRequest(final HttpServletRequest request) {
        this.request = request;
    }
}
