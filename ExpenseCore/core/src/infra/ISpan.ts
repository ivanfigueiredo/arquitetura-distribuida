import { Span } from "@opentelemetry/api";

export type Headers = {
    traceparent: string;
};

export interface ISpan {
    setContext(headers: Headers): void;
    startSpanWithoutContext(spanName: string): void;
    startSpanWithContext(spanName: string): void;
    endSpanWithoutContext(): void;
    endSpanWithContext(): void;
    contextPropagationWith(): Record<string, string>;
    getSpanServer(): Span;
}