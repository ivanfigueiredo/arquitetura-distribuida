package com.maildispatcher.core.configuration

import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.api.common.Attributes
import io.opentelemetry.api.logs.LogRecordBuilder
import io.opentelemetry.api.trace.Tracer
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator
import io.opentelemetry.context.propagation.ContextPropagators
import io.opentelemetry.context.propagation.TextMapPropagator
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
import io.opentelemetry.exporter.otlp.logs.OtlpGrpcLogRecordExporter
import io.opentelemetry.instrumentation.logback.appender.v1_0.OpenTelemetryAppender
import io.opentelemetry.sdk.OpenTelemetrySdk
import io.opentelemetry.sdk.logs.SdkLoggerProvider
import io.opentelemetry.sdk.logs.export.BatchLogRecordProcessor
import io.opentelemetry.sdk.resources.Resource
import io.opentelemetry.sdk.trace.SdkTracerProvider
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.*

@Configuration
open class OpenTelemetryConfig {
    @Value("\${mail.dispatcher.otlp.tracing-server}")
    private lateinit var tracingServer: String

    @Value("\${mail.dispatcher.otlp.log-server}")
    private lateinit var logServer: String

    private var serviceName = "service.name"
    private var serviceVersion = "version"
    private var serviceInstanceId = "service.instance.id"
    private var serviceInstanceIdValue = UUID.randomUUID().toString()
    private var hostName = "Host.Name"
    private var hostNameValue = "HOSTNAME"
    private var serviceNameValue = "Expense_Core"
    private var processPid = "Process.PID"
    private var processPidValue = ProcessHandle.current().pid().toString()
    private var serviceVersionValue = "0.1.0"
    private var nameSpace = "namespace"
    private var nameSpaceValue = "Company"
    @Bean
    open fun openTelemetry(): OpenTelemetry {
        val resource = Resource.getDefault()
            .merge(
                Resource.create(
                    Attributes.builder()
                        .put(serviceName, serviceNameValue)
                        .put(serviceVersion, serviceVersionValue)
                        .put(serviceInstanceId, serviceInstanceIdValue)
                        .put(hostName, hostNameValue)
                        .put(processPid, processPidValue)
                        .put(nameSpace, nameSpaceValue)
                        .build()
                )
            )
        val sdkTracerProvider = SdkTracerProvider.builder()
            .addSpanProcessor(
                BatchSpanProcessor.builder(
                    OtlpHttpSpanExporter.builder().setEndpoint(tracingServer).build()
                ).build()
            )
            .setResource(resource)
            .build()
        val sdkLoggerProvider = SdkLoggerProvider.builder()
            .addLogRecordProcessor(BatchLogRecordProcessor.builder(OtlpGrpcLogRecordExporter.builder().setEndpoint(logServer).build()).build())
            .setResource(resource)
            .build()
        val openTelemetry = OpenTelemetrySdk.builder()
            .setTracerProvider(sdkTracerProvider)
            .setLoggerProvider(sdkLoggerProvider)
            .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
            .buildAndRegisterGlobal()

        OpenTelemetryAppender.install(openTelemetry)
        return openTelemetry
    }

    @Bean
    open fun globalTracer(openTelemetry: OpenTelemetry): Tracer {
        return openTelemetry.getTracer(serviceNameValue, serviceVersionValue)
    }

    @Bean
    open fun makeContext(openTelemetry: OpenTelemetry): TextMapPropagator {
        val propagators = openTelemetry.propagators
        return propagators.textMapPropagator
    }

    @Bean
    open fun logRecordBuilder(openTelemetry: OpenTelemetry): LogRecordBuilder {
        return openTelemetry.logsBridge.loggerBuilder(serviceNameValue).build().logRecordBuilder()
    }
}
