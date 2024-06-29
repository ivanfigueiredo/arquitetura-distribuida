import { LoggerProvider, Logger } from '@opentelemetry/api-logs';
import { ILogger } from "./ILogger";
import { Context, ROOT_CONTEXT, Span, trace } from '@opentelemetry/api';
import { ILoggerContext } from './ILoggerContext';
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