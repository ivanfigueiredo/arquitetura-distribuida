export interface IApplicationSpan {
    startSpan(spanName: string, callback: Function): Promise<void>;
}