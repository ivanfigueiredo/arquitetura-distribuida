package com.maildispatcher.core.configuration

import com.maildispatcher.core.Span
import io.opentelemetry.api.trace.Tracer
import io.opentelemetry.context.propagation.TextMapPropagator
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
open class SpanConfig {
    @Bean
    open fun span(tracer: Tracer, textMapPropagator: TextMapPropagator): Span {
        return Span(tracer, textMapPropagator)
    }
}