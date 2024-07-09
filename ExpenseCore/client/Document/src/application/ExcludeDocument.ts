import { ILogger, IStateManeger } from "expense-core";
import { IExcludeDocument } from "./IExcludeDocument";
import { IDocumentRepository } from "./IDocumentRepository";
import { DocumentCreatedDto } from "./dto/DocumentCreatedDto";

export class ExcludeDocument implements IExcludeDocument {
    constructor(
        private readonly stateManager: IStateManeger,
        private readonly documentRepository: IDocumentRepository,
        private readonly logger: ILogger
    ) { }

    async execute(): Promise<void> {
        try {
            this.logger.info(`ExcludeDocument - Iniciando microsservico para inclusao do documento`)
            const documentCreated = await this.stateManager.get<DocumentCreatedDto>('DocumentIncluded')
            if (documentCreated) {
                this.logger.info(`ExcludeDocument - Recuperando Estado de IncludeDocument`)
                const document = await this.documentRepository.findDocumentById(documentCreated.id)
                if (document) {
                    await this.documentRepository.delete(document)
                }
            }
            this.logger.info(`ExcludeDocument - Estado nao recuperado`)
        } catch (error: any) {
            this.logger.error(`ExcludeDocument - Error: ${error.message}`)
        }
    }
}