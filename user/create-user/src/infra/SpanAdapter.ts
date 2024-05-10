import { trace, context } from '@opentelemetry/api';
import { Headers, ISpan } from "./ISpan";
import { IApplicationSpan } from '../application/IApplicationSpan';

export class SpanAdapter implements ISpan,IApplicationSpan {
    private headers?: Headers;
    private readonly SERVICE_NAME = "create.user.service";
    private readonly SERVICE_VERSION = "0.0.1";

    constructor() {}

    public setHeaders(headers: Headers): void {
        this.headers = headers;

    }

    public async startSpan(spanName: string, callback: Function): Promise<void> {
        const tracer = trace.getTracer(this.SERVICE_NAME, this.SERVICE_VERSION);
        const traceparent = this.headers!.traceparent.split("-");
        const contextResult = trace.setSpanContext(context.active(), {
            traceId: traceparent[1],
            spanId: traceparent[2],
            traceFlags: 1,
            isRemote: true
        });
        const span = tracer.startSpan(spanName, {}, contextResult);
        await callback();
        span.end();
    }
    
}