import { RabbitMQAdapter } from './infra/Queue/RabbitMQAdapter';
import { OpenTelemetrySDK } from './infra/OpenTelemetrySDK';
import { SpanAdapter } from './infra/SpanAdapter';
import { ISpan } from './infra/ISpan';
import { ExpenserLogger } from './infra/ExpenseLogger';

export class ExpenseCoreMain {
    private rabbitMQAdapter?: RabbitMQAdapter;
    private spanAdapter?: ISpan;
    private serviceName: string;
    private command: string;

    constructor(serviceName: string, command: string) {
        this.command = command;
        this.serviceName = serviceName;
    }

    public async initialize(serviceInstance: any): Promise<void> {
        const openTelemetrySdk = new OpenTelemetrySDK(this.serviceName, this.command);
        const expenseLogger = new ExpenserLogger(openTelemetrySdk.getLoggerProvider, this.serviceName);
        this.spanAdapter = new SpanAdapter(this.serviceName, '0.0.1');
        this.rabbitMQAdapter = new RabbitMQAdapter(this.spanAdapter);
        await this.rabbitMQAdapter.connect();
        serviceInstance.rabbitMQAdapter = this.rabbitMQAdapter;
        serviceInstance.span = this.spanAdapter;
        serviceInstance.logger = expenseLogger;
        serviceInstance.loggerContext = expenseLogger;
        await serviceInstance.init();
    }
}