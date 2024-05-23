export type Headers = {
    traceparent: string;
    correlationId: string;
};

export interface ISpan {
    setContext(headers: Headers): void;
    startSpan(spanName: string): void;
    endSpan(): void;
}