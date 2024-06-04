package com.maildispatcher.core

import io.opentelemetry.api.trace.SpanKind
import io.opentelemetry.api.trace.Tracer
import io.opentelemetry.context.Context
import io.opentelemetry.context.propagation.TextMapPropagator
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class Span(private var tracer: Tracer, private var textMapPropagator: TextMapPropagator) : ISpan {
    private lateinit var headers: Map<String, Any>

    override fun setHeaders(headers: Map<String, Any>) {
        this.headers = headers
    }

    override fun getHeaders(): MutableMap<String, String> {
        val map = mutableMapOf<String, String>()
        this.headers.forEach { (key, value) -> if (value is String) {map[key] = value} }
        return map
    }


    override fun startSpan(spanName: String, function: ICallback) {
        val context = makeContext()
        val span = tracer.spanBuilder(spanName)
            .setParent(context)
            .setSpanKind(SpanKind.SERVER)
            .startSpan()
        try {
            span.makeCurrent().use {
                function.apply()
            }
        } catch (e: Exception) {
            span.recordException(e)
        } finally {
            span.end(Instant.now())
        }
    }

    private fun makeContext(): Context {
        val map = this.getHeaders()
        return this.textMapPropagator.extract(Context.current(), map, HeaderGetter())
    }
}