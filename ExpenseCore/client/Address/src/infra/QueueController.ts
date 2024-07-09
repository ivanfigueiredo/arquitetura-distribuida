import { ILogger, Queue } from "expense-core"
import { IIncludeAddress } from "../application/IIncludeAddress"
import { IncludeAddressDto } from "../application/dto/IncludeAddressDto"
import { IExcludeAddress } from "../application/IExcludeAddress"

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly logger: ILogger,
        readonly includeAddress: IIncludeAddress,
        readonly excludeAddress: IExcludeAddress
    ) {
        queue.consume("client.include-address.queue", "client.events", "client.include-address", async (input: IncludeAddressDto) => {
            logger.info("Recebendo evento para inclusao do endereco")
            await this.includeAddress.execute(input)
        })
        queue.consume("client.exclude-address.queue", "client.events", "client.exclude-address", async () => {
            logger.info("Recebendo evento para exclusao do endereco")
            await this.excludeAddress.execute()
        })
    }
}