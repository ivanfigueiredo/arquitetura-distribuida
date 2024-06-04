package com.maildispatcher.core

import io.opentelemetry.context.propagation.TextMapGetter

class HeaderGetter : TextMapGetter<Map<String, String>> {
    override fun keys(carrier: Map<String, String>): Iterable<String> {
        return carrier.keys
    }

    override fun get(carrier: Map<String, String>?, key: String): String? {
        return carrier?.get(key)
    }
}