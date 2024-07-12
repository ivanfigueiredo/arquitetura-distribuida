import { ILogger, Queue } from "expense-core"
import { IIncludeAddress } from "../application/IIncludeAddress"
import { IncludeAddressDto } from "../application/dto/IncludeAddressDto"

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly logger: ILogger,
        readonly includeAddress: IIncludeAddress
    ) {
        queue.consume("client.include-address.queue", "client.events", "client.include-address", async (input: IncludeAddressDto) => {
            logger.info("Recebendo evento para inclusao do endereco")
            await this.includeAddress.execute(input)
        })
    }
}