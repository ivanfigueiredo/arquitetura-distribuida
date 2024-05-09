import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
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

    constructor() {
        this.otlpTraceExporter = new OTLPTraceExporter({
            url: "http://opentelemetry-collector:4318/v1/traces"
        });
        this.spanProcessor = new BatchSpanProcessor(this.otlpTraceExporter);
        this.sdk = new NodeSDK({
            resource: new Resource({
                [SEMRESATTRS_SERVICE_NAME]: 'create.user.service',
                [SEMRESATTRS_SERVICE_VERSION]: '0.0.1',
                [SEMRESATTRS_PROCESS_PID]: process.pid.toString(),
                [SEMRESATTRS_SERVICE_INSTANCE_ID]: randomUUID(),
                [SEMRESATTRS_PROCESS_COMMAND]: 'user.created.queue',
            }),
            traceExporter: this.otlpTraceExporter,
            spanProcessor: this.spanProcessor,
        });
        this.sdk.start();
    }

}