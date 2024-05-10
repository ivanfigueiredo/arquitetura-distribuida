package com.expensemaster.infra.configuration;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.propagation.ContextPropagators;
import io.opentelemetry.context.propagation.TextMapPropagator;
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class OpenTelemetryConfig {
    @Value("${expense.master.otlp.tracing-server}")
    private String tracingServer;

    private static final String SERVICE_NAME = "service.name";
    private static final String SERVICE_VERSION = "version";
    private static final String SERVICE_INSTANCE_ID = "service.instance.id";
    private static final String SERVICE_INSTANCE_ID_VALUE = UUID.randomUUID().toString();
    private static final String HOST_NAME = "Host.Name";
    private static final String HOST_NAME_VALUE = "HOSTNAME";
    private static final String SERVICE_NAME_VALUE = "Expense_Master";
    private static final String PROCESS_PID = "Process.PID";
    private static final String PROCESS_PID_VALUE = String.valueOf(ProcessHandle.current().pid());
    private static final String SERVICE_VERSION_VALUE = "0.1.0";
    private static final String NAMESPACE = "namespace";
    private static final String NAMESPACE_VALUE = "Company";

    @Bean
    public OpenTelemetry openTelemetry() {
        Resource resource = Resource.getDefault()
                .merge(Resource.create(Attributes.builder()
                        .put(SERVICE_NAME, SERVICE_NAME_VALUE)
                        .put(SERVICE_VERSION, SERVICE_VERSION_VALUE)
                        .put(SERVICE_INSTANCE_ID, SERVICE_INSTANCE_ID_VALUE)
                        .put(HOST_NAME, HOST_NAME_VALUE)
                        .put(PROCESS_PID, PROCESS_PID_VALUE)
                        .put(NAMESPACE, NAMESPACE_VALUE)
                        .build()
                ));

        SdkTracerProvider sdkTracerProvider = SdkTracerProvider.builder()
                .addSpanProcessor(BatchSpanProcessor.builder(OtlpHttpSpanExporter.builder().setEndpoint(tracingServer).build()).build())
                .setResource(resource)
                .build();

        return OpenTelemetrySdk.builder()
                .setTracerProvider(sdkTracerProvider)
                .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
                .buildAndRegisterGlobal();
    }

    @Bean
    public Tracer globalTracer(final OpenTelemetry openTelemetry) {
        return openTelemetry.getTracer(SERVICE_NAME_VALUE, SERVICE_VERSION_VALUE);
    }

    @Bean
    public TextMapPropagator makeContext(final OpenTelemetry openTelemetry) {
        final var propagators = openTelemetry.getPropagators();
        return propagators.getTextMapPropagator();
    }
}
