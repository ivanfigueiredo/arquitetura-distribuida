import { ILogger, IStateManeger, Queue } from "expense-core";
import { Document } from "../domain/Document";
import { IDocumentRepository } from "./IDocumentRepository";
import { IIncludeDocument } from "./IIncludeDocument";
import { DocumentDto } from "./dto/DocumentDto";
import { DocumentCreatedDto } from "./dto/DocumentCreatedDto";

export class IncludeDocument implements IIncludeDocument {
    constructor(
        private readonly stateManager: IStateManeger,
        private readonly documentRepository: IDocumentRepository,
        private readonly queue: Queue,
        private readonly logger: ILogger
    ) { }

    public async execute(dto: DocumentDto): Promise<void> {
        try {
            this.logger.info(`IncludeDocument - Iniciando microsservico para adicionar documento`)
            const document = Document.create(dto.clientId, dto.documentName, dto.documentNumber)
            await this.documentRepository.save(document)
            this.logger.info(`IncludeDocument - Documento adicionado com sucesso`)
            this.logger.info(`IncludeDocument - Salvando Estado da execucao`)
            await this.stateManager.set<DocumentCreatedDto>(
                'DocumentIncluded',
                new DocumentCreatedDto(document.id, document.clientId, document.documentName, document.documentNumber.value)
            )
            this.logger.info('IncludeDocument - Chamando ClientRegistration')
            await this.queue.publish(
                'client.events',
                'client.registration.step-3',
                {
                    document: {
                        id: document.id,
                        documentName: document.documentName,
                        documentNumber: document.documentNumber,
                    },
                    error: undefined
                }
            )
        } catch (error: any) {
            this.logger.error(`IncludeDocument - Error: ${error.message}`)
            await this.queue.publish(
                'client.events',
                'client.registration.step-3',
                {
                    document: undefined,
                    error: { message: error.message }
                }
            )
        }
    }
}