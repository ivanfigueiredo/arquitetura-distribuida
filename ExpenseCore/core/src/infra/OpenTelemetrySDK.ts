import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import {
    SEMRESATTRS_SERVICE_NAME,
    SEMRESATTRS_SERVICE_VERSION,
    SEMRESATTRS_PROCESS_PID,
    SEMRESATTRS_SERVICE_INSTANCE_ID,
    SEMRESATTRS_PROCESS_COMMAND
} from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { randomUUID } from 'crypto';

export class OpenTelemetrySDK {
    private sdk: NodeSDK;
    private spanProcessor: BatchSpanProcessor;
    private otlpTraceExporter: OTLPTraceExporter;
    private otlpLogExporter: OTLPLogExporter;
    private logRecordProcessor: BatchLogRecordProcessor;
    private loggerProvider: LoggerProvider;

    constructor(
        serviceName: string,
        command: string
    ) {
        const resource = new Resource({
            [SEMRESATTRS_SERVICE_NAME]: serviceName,
            [SEMRESATTRS_SERVICE_VERSION]: '0.0.1',
            [SEMRESATTRS_PROCESS_PID]: process.pid.toString(),
            [SEMRESATTRS_SERVICE_INSTANCE_ID]: randomUUID(),
            [SEMRESATTRS_PROCESS_COMMAND]: command,
        });
        this.loggerProvider = new LoggerProvider({
            resource
        })
        this.otlpTraceExporter = new OTLPTraceExporter({
            url: "http://opentelemetry-collector:4318/v1/traces"
        });
        this.otlpLogExporter = new OTLPLogExporter({
            url: "http://opentelemetry-collector:4318/v1/logs",
        });
        const metricExporter = new OTLPMetricExporter({
            url: "http://opentelemetry-collector:4318/v1/metrics",
        });

        this.logRecordProcessor = new BatchLogRecordProcessor(this.otlpLogExporter);
        this.loggerProvider.addLogRecordProcessor(this.logRecordProcessor);
        this.spanProcessor = new BatchSpanProcessor(this.otlpTraceExporter);
        this.sdk = new NodeSDK({
            resource,
            traceExporter: this.otlpTraceExporter,
            spanProcessor: this.spanProcessor,
            logRecordProcessor: this.logRecordProcessor,
            metricReader: new PeriodicExportingMetricReader({
                exporter: metricExporter,
            })
        });
        this.sdk.start();
    }

    public get getLoggerProvider(): LoggerProvider {
        return this.loggerProvider;
    }

}