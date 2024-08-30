import { RabbitMQAdapter } from './infra/Queue/RabbitMQAdapter';
import { OpenTelemetrySDK } from './infra/OpenTelemetrySDK';
import { SpanAdapter } from './infra/SpanAdapter';
import { ISpan } from './infra/ISpan';
import { ExpenserLogger } from './infra/ExpenseLogger';
import { StateManager } from './infra/StateManager';
import { Idempotency } from './infra/idempotency/Idempotency';
import { RedisAdapter } from './infra/redis';

export class ExpenseCoreMain {
    private rabbitMQAdapter?: RabbitMQAdapter
    private spanAdapter?: ISpan
    private serviceName: string
    private command: string

    constructor(serviceName: string, command: string) {
        this.command = command
        this.serviceName = serviceName
    }

    public async initialize(serviceInstance: any): Promise<void> {
        const openTelemetrySdk = new OpenTelemetrySDK(this.serviceName, this.command)
        const expenseLogger = new ExpenserLogger(openTelemetrySdk.getLoggerProvider, this.serviceName)
        const clientRedis = new RedisAdapter()
        await clientRedis.connection()
        const stateManager = new StateManager(clientRedis.getRedisClient())
        this.spanAdapter = new SpanAdapter(this.serviceName, '0.0.1')
        this.rabbitMQAdapter = new RabbitMQAdapter(this.spanAdapter, expenseLogger, stateManager)
        await this.rabbitMQAdapter.connect()
        const idempotency = new Idempotency(clientRedis.getRedisClient())
        serviceInstance.rabbitMQAdapter = this.rabbitMQAdapter
        serviceInstance.span = this.spanAdapter
        serviceInstance.logger = expenseLogger
        serviceInstance.loggerContext = expenseLogger
        serviceInstance.stateManager = stateManager
        serviceInstance.idempotency = idempotency
        await serviceInstance.init()
    }
}