package com.expensemaster.core.configuration;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.logs.LogRecordBuilder;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.propagation.ContextPropagators;
import io.opentelemetry.context.propagation.TextMapPropagator;
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.exporter.otlp.logs.OtlpGrpcLogRecordExporter;
import io.opentelemetry.instrumentation.logback.appender.v1_0.OpenTelemetryAppender;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.logs.SdkLoggerProvider;
import io.opentelemetry.sdk.logs.export.BatchLogRecordProcessor;
import io.opentelemetry.exporter.logging.SystemOutLogRecordExporter;
import io.opentelemetry.sdk.logs.export.BatchLogRecordProcessorBuilder;
import io.opentelemetry.sdk.logs.export.SimpleLogRecordProcessor;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;
import java.util.logging.LogRecord;

@Configuration
public class OpenTelemetryConfig {
    @Value("${expense.master.otlp.tracing-server}")
    private String tracingServer;

    @Value("${expense.master.otlp.log-server}")
    private String logServer;

    private static final String SERVICE_NAME = "service.name";
    private static final String SERVICE_VERSION = "version";
    private static final String SERVICE_NAME_VALUE = "Expense_Master";
    private static final String PROCESS_PID = "Process.PID";
    private static final String PROCESS_PID_VALUE = String.valueOf(ProcessHandle.current().pid());
    private static final String SERVICE_VERSION_VALUE = "0.1.0";

    @Bean
    public OpenTelemetry openTelemetry() {
        Resource resource = Resource.getDefault()
                .merge(Resource.create(Attributes.builder()
                        .put(SERVICE_NAME, SERVICE_NAME_VALUE)
                        .put(SERVICE_VERSION, SERVICE_VERSION_VALUE)
                        .put(PROCESS_PID, PROCESS_PID_VALUE)
                        .build()
                ));



        SdkLoggerProvider sdkLoggerProvider = SdkLoggerProvider.builder()
                .addLogRecordProcessor(BatchLogRecordProcessor.builder(OtlpGrpcLogRecordExporter.builder().setEndpoint(logServer).build()).build())
                .setResource(resource)
                .build();

        SdkTracerProvider sdkTracerProvider = SdkTracerProvider.builder()
                .addSpanProcessor(BatchSpanProcessor.builder(OtlpHttpSpanExporter.builder().setEndpoint(tracingServer).build()).build())
                .setResource(resource)
                .build();

        final var openTelemetrySdk = OpenTelemetrySdk.builder()
                .setTracerProvider(sdkTracerProvider)
                .setLoggerProvider(sdkLoggerProvider)
                .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
                .buildAndRegisterGlobal();

        OpenTelemetryAppender.install(openTelemetrySdk);

        return openTelemetrySdk;
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

    @Bean
    public LogRecordBuilder logRecordBuilder(final OpenTelemetry openTelemetry) {
        return openTelemetry.getLogsBridge().loggerBuilder(SERVICE_NAME_VALUE).build().logRecordBuilder();
    }
}
