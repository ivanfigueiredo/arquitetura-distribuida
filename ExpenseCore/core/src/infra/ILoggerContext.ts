import { Span } from '@opentelemetry/api';
import { Headers } from './ISpan';

export interface ILoggerContext {
    setContext(span: Span): void;
    setOtherContext(headers: Headers): void;
}