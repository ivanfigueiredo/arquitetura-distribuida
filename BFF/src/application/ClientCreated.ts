import { IPubSub } from "../infra/PubSub";
import { ClientCreatedDto } from "./dto/ClientCreatedDto";
import { IClientCreated } from "./IClientCreated";

export class ClientCreated implements IClientCreated {
    constructor(private readonly pubsub: IPubSub) { }

    async execute(dto: ClientCreatedDto): Promise<void> {
        this.pubsub.publish('PAYMENT', dto);
    }
}
