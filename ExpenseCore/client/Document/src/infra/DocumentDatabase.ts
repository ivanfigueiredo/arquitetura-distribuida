import { ILogger } from "expense-core";
import { IDocumentRepository } from "../application/IDocumentRepository"
import { Document } from "../domain/Document";
import { DocumentEntity } from "./entities/DocumentEntity";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";
import { Repository } from "typeorm";
import { DatabaseConnection } from "./DatabaseConnection";

export class DocumentDatabase implements IDocumentRepository {
    private readonly repository: Repository<DocumentEntity>

    constructor(
        private readonly connection: DatabaseConnection,
        private readonly logger: ILogger
    ) {
        this.repository = this.connection.getDataSourcer().getRepository(DocumentEntity)
    }

    async save(document: Document): Promise<void> {
        try {
            await this.repository.save(DocumentEntity.from(document))
        } catch (error: any) {
            this.logger.error(`DocumentDatabase - Error: ${error.message}`)
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }

    async findDocumentById(documentId: string): Promise<Document | null> {
        const documentEntity = await this.repository.findOne({ where: { documentId } })
        if (!documentEntity) return null
        return documentEntity.to()
    }

    async delete(document: Document): Promise<void> {
        await this.repository.delete({ documentId: document.id })
    }
}