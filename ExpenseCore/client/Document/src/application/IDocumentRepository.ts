import { Document } from '../domain/Document'

export interface IDocumentRepository {
    save(document: Document): Promise<void>
    findDocumentById(documentId: string): Promise<Document | null>
    delete(document: Document): Promise<void>
}