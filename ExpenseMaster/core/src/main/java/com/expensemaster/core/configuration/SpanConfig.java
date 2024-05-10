package com.expensemaster.infra.configuration;

import com.expensemaster.application.IApplicationSpan;
import com.expensemaster.infra.SpanAdapter;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.propagation.TextMapPropagator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class SpanConfig {
    private final Tracer tracer;
    private final TextMapPropagator textMapPropagator;

    public SpanConfig(
            final Tracer tracer,
            final TextMapPropagator textMapPropagator
    ) {
        this.textMapPropagator = Objects.requireNonNull(textMapPropagator);
        this.tracer = Objects.requireNonNull(tracer);
    }

    @Bean
    public IApplicationSpan createUserSpan() {
        return new SpanAdapter(tracer, textMapPropagator);
    }
}
