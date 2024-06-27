package com.maildispatcher.core

import io.opentelemetry.api.trace.SpanKind

interface ISpan {
    fun setHeaders(headers: Map<String, Any>);
    fun getHeaders(): MutableMap<String, String>
    fun startSpan(spanName: String, kind: SpanKind, function: ICallback);
}