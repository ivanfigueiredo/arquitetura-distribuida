import { Span } from '@opentelemetry/api';

export interface ILoggerContext {
    setContext(span: Span): void;
}