import { trace, context, Context, Tracer, Span } from '@opentelemetry/api';
import { Headers, ISpan } from "./ISpan";

export class SpanAdapter implements ISpan {
    private readonly SERVICE_NAME = "create.user.service";
    private readonly SERVICE_VERSION = "0.0.1";
    private headers?: Headers;
    private tracer: Tracer;
    private context?: Context;
    private span?: Span;

    constructor() {
        this.tracer = trace.getTracer(this.SERVICE_NAME, this.SERVICE_VERSION);
    }

    public setContext(headers: Headers): void {
        this.headers = headers;
        const traceparent = headers!.traceparent.split("-");
        this.context = trace.setSpanContext(context.active(), {
            traceId: traceparent[1],
            spanId: traceparent[2],
            traceFlags: 1,
            isRemote: true
        });
    }

    public getHeaders(): Headers {
        return this.headers!;
    }

    public startSpan(spanName: string): void {
        this.span = this.tracer.startSpan(spanName, {}, this.context as Context);
    }

    public endSpan(): void {
        this.span!.end();
    }

}