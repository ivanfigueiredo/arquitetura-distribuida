import { IPubSub } from "../infra/PubSub";
import { ClientCreatedErrorDto } from "./dto/ClientCreatedErrorDto";
import { IClientCreatedError } from "./IClientCreatedError";

export class ClientCreatedError implements IClientCreatedError {
    constructor(private readonly pubsub: IPubSub) { }

    public async execute(dto: ClientCreatedErrorDto): Promise<void> {
        this.pubsub.publish('PAYMENT', {
            eventName: 'CLIENT_REGISTRATION',
            timestamp: dto.error.timestamp,
            data: undefined,
            error: {
                message: dto.error.message,
                statusCode: dto.error.statusCode
            }

        })
    }
}