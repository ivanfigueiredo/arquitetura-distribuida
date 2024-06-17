package com.expensemaster.core.configuration;

import com.expensemaster.application.IApplicationSpan;
import com.expensemaster.core.ISpanAdapter;
import com.expensemaster.core.SpanAdapter;
import com.expensemaster.user.IUserSpan;
import io.opentelemetry.api.logs.LogRecordBuilder;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.propagation.TextMapPropagator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class SpanConfig {
    private final Tracer tracer;
    private final TextMapPropagator textMapPropagator;
    private final LogRecordBuilder logRecordBuilder;

    public SpanConfig(
            final Tracer tracer,
            final TextMapPropagator textMapPropagator,
            final LogRecordBuilder logRecordBuilder
    ) {
        this.textMapPropagator = Objects.requireNonNull(textMapPropagator);
        this.tracer = Objects.requireNonNull(tracer);
        this.logRecordBuilder = Objects.requireNonNull(logRecordBuilder);
    }

    @Bean
    public ISpanAdapter createSpanAdapter() {
        return new SpanAdapter(tracer, textMapPropagator, logRecordBuilder);
    }
}
