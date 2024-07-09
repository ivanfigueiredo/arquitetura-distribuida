import { ILogger, Queue } from "expense-core"
import { IIncludeDocument } from "../application/IIncludeDocument"
import { DocumentDto } from "../application/dto/DocumentDto"
import { IExcludeDocument } from "../application/IExcludeDocument"

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly logger: ILogger,
        readonly includeDocument: IIncludeDocument,
        readonly excludeDocument: IExcludeDocument
    ) {
        queue.consume("client.include-document.queue", "client.events", "client.include-document", async (input: DocumentDto) => {
            logger.info("Recebendo evento para inclusao do documento")
            await this.includeDocument.execute(input)
        })
        queue.consume("client.exclude-document.queue", "client.events", "client.exclude-document", async () => {
            logger.info("Recebendo evento para exclusao do documento")
            await this.excludeDocument.execute()
        })
    }
}