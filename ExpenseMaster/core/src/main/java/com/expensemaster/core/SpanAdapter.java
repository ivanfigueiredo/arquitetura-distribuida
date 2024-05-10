package com.expensemaster.infra;

import com.expensemaster.application.ICallback;
import com.expensemaster.application.IApplicationSpan;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import io.opentelemetry.context.propagation.TextMapPropagator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Objects;

@Component
public class SpanAdapter implements IApplicationSpan, ISpanAdapter {
    private final Tracer tracer;
    private final TextMapPropagator textMapPropagator;
    private HttpServletRequest request;

    public SpanAdapter(
            final Tracer tracer,
            final TextMapPropagator textMapPropagator
    ) {
        this.tracer = Objects.requireNonNull(tracer);
        this.textMapPropagator = Objects.requireNonNull(textMapPropagator);
    }

    @Override
    public void startSpan(final String spanName, ICallback function) {
        final var contextResult = this.makeContext(this.request, this.textMapPropagator);
        final var span = tracer.spanBuilder(spanName)
                .setParent(contextResult)
                .setSpanKind(SpanKind.SERVER)
                .startSpan();
        try(Scope scope = span.makeCurrent()) {
            try {
                function.apply();
            } finally {
                span.end(Instant.now());
            }
        }
    }

    @Override
    public MessageProperties contextPropagation() {
        final var correlationId = this.request.getHeader("x-correlation-id");
        final var messageProperties = new MessageProperties();
        final var context = this.makeContext(this.request, this.textMapPropagator);
        messageProperties.setHeader("correlationId", correlationId);

        this.textMapPropagator.inject(context, messageProperties.getHeaders(), (carrier, key, value) -> {
            carrier.put(key, value);
        });

        return messageProperties;
    }

    private Context makeContext(final HttpServletRequest request, final TextMapPropagator textMapPropagator) {
        return textMapPropagator.extract(Context.current(), request, new HeaderGetter());
    }

    @Override
    public void setHttpRequest(final HttpServletRequest request) {
        this.request = request;
    }
}
