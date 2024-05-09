package com.expensemaster.infra;

import io.opentelemetry.context.propagation.TextMapGetter;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Set;

public class HeaderGetter implements TextMapGetter<Object> {
    @Override
    public Iterable<String> keys(Object carrier) {
        return Set.of("traceparent");
    }

    @Override
    public String get(Object carrier, String key) {
        return ((HttpServletRequest) carrier).getHeader(key);
    }
}
