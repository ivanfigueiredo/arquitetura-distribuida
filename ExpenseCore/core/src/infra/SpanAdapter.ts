import { trace, Context, Tracer, Span, SpanKind, ROOT_CONTEXT, propagation } from '@opentelemetry/api';
import { Headers, ISpan } from "./ISpan";

export class SpanAdapter implements ISpan {
    [key: string]: any;
    private readonly SERVICE_NAME = "Expense_Core";
    private readonly SERVICE_VERSION = "0.0.1";
    private tracer: Tracer;
    private context?: Context;
    private spanWithContext?: Span;
    private spanWithoutContext?: Span;

    constructor(serviceName: string, version: string) {
        this.tracer = trace.getTracer(serviceName, version);
    }

    public setContext(headers: Headers): void {
        this.context = propagation.extract(ROOT_CONTEXT, headers)
    }

    public startSpanWithoutContext(spanName: string): void {
        this.spanWithoutContext = this.tracer.startSpan(spanName, { kind: SpanKind.SERVER, startTime: new Date() }, this.context as Context);
    }

    public endSpanWithoutContext(): void {
        this.spanWithoutContext!.end(new Date());
    }

    public startSpanWithContext(spanName: string): void {
        this.spanWithContext = this.tracer.startSpan(spanName, { kind: SpanKind.CLIENT, startTime: new Date() }, this.context!)
    }

    public endSpanWithContext(): void {
        this.spanWithContext!.end(new Date());
    }

    public getSpanServer(): Span {
        return this.spanWithoutContext!
    }

    public contextPropagationWith(): Record<string, string> {
        const context = trace.setSpanContext(ROOT_CONTEXT, this.spanWithContext!.spanContext())
        const headers: Record<string, string> = {}
        propagation.inject(context, headers)
        return headers
    }

}