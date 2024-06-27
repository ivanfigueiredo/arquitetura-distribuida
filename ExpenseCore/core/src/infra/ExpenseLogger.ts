import { LoggerProvider, Logger } from '@opentelemetry/api-logs';
import { ILogger } from "./ILogger";
import { Context, ROOT_CONTEXT, Span, SpanContext, trace } from '@opentelemetry/api';
import { ILoggerContext } from './ILoggerContext';
import { Headers } from './ISpan';


export class ExpenserLogger implements ILogger, ILoggerContext {
    private logger: Logger;
    private context?: Context;

    constructor(
        loggerProvider: LoggerProvider,
        serviceName: string
    ) {
        this.logger = loggerProvider.getLogger(serviceName, '0.0.1')
    }

    public setContext(span: Span): void {
        this.context = trace.setSpanContext(ROOT_CONTEXT, span.spanContext())
    }

    public setOtherContext(headers: Headers): void {
        const traceparent = headers!.traceparent.split("-");
        const spanContext: SpanContext = {
            traceId: traceparent[1],
            spanId: traceparent[2],
            traceFlags: 1,
            isRemote: true
        };
        this.context = trace.setSpanContext(ROOT_CONTEXT, spanContext);
    }


    public info(msg: string): void {
        this.logger.emit({
            severityText: 'info',
            body: msg,
            context: this.context!,
        })
    }

    public error(msg: string): void {
        this.logger.emit({
            severityText: 'error',
            body: msg,
            context: this.context!,
        });
    }
}