import { RabbitMQAdapter } from './infra/Queue/RabbitMQAdapter';
import { OpenTelemetrySDK } from './infra/OpenTelemetrySDK';
import { SpanAdapter } from './infra/SpanAdapter';
import { ISpan } from './infra/ISpan';

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
        new OpenTelemetrySDK(this.serviceName, this.command);
        this.spanAdapter = new SpanAdapter();
        this.rabbitMQAdapter = new RabbitMQAdapter(this.spanAdapter);
        await this.rabbitMQAdapter.connect();
        serviceInstance.rabbitMQAdapter = this.rabbitMQAdapter;
        serviceInstance.span = this.spanAdapter;
        await serviceInstance.init();
    }
}