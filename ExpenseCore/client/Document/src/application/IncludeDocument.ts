import { ILogger, IStateManeger, Queue, IIdempotency } from "expense-core";
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
        private readonly logger: ILogger,
        private readonly idempotencyManager: IIdempotency
    ) { }

    public async execute(dto: DocumentDto): Promise<void> {
        try {
            this.logger.info(`IncludeDocument - Iniciando microsservico para adicionar documento`)
            this.logger.info(`IncludeDocument - Validando Idempotencia`)
            await this.idempotencyManager.checkIdempotency({documentNumber: dto.documentNumber})
            const document = Document.create(dto.clientId, dto.documentName, dto.documentNumber)
            const payload = await this.idempotencyManager.retrieveProcessedResult<Document>()
            if (payload) {
                this.logger.info('IncludeDocument - Evento já processado')
                await this.publish(payload)
                return
            }
            await this.documentRepository.save(document)
            this.logger.info('IncludeDocument - Salvando estado do evento processado')
            await this.idempotencyManager.saveIdempotency<{documentNumber: string}, Document>({documentNumber: dto.documentNumber}, document)
            this.logger.info(`IncludeDocument - Documento adicionado com sucesso`)
            this.logger.info(`IncludeDocument - Salvando Estado da execucao`)
            await this.stateManager.set<DocumentCreatedDto>(
                'DocumentIncluded',
                new DocumentCreatedDto(document.id, document.clientId, document.documentName, document.documentNumber.value)
            )
            this.logger.info('IncludeDocument - Chamando ClientRegistration')
            await this.publish(document)
            this.logger.info('IncludeDocument - Atualizando status processamento do evento')
            await this.idempotencyManager.updateIdempotencyStatus()
        } catch (error: any) {
            this.logger.error(`IncludeDocument - Error: ${error.message}`)
            if (error.message === 'Concurrent transaction.') {
                throw error
            }
            await this.queue.publish(
                'client.events',
                'client.registration.step-3',
                {
                    document: undefined,
                    error: { 
                        message: error.message,
                        status: error.status
                    }
                }
            )
        }
    }

    private async publish(payload: Document): Promise<void> {
        await this.queue.publish(
            'client.events',
            'client.registration.step-3',
            {
                document: {
                    id: payload.id,
                    documentName: payload.documentName,
                    documentNumber: payload.documentNumber,
                },
                error: undefined
            }
        )
    }
}