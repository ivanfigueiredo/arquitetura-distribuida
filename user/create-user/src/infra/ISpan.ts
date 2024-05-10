export type Headers = {
    traceparent: string;
    correlationId: string;
};

export interface ISpan {
    setHeaders(headers: Headers): void;
    startSpan(spanName: string, callback: Function): Promise<void>;
}