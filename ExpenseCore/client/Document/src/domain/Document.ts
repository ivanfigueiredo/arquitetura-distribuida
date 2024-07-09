import { randomUUID } from "crypto"
import { DocumentNumber } from "./DocumentNumber"

export class Document {
    private constructor(
        readonly id: string,
        readonly clientId: string,
        readonly documentName: string,
        readonly documentNumber: DocumentNumber,
    ) { }

    public static create(clientId: string, documentName: string, documentNumber: string): Document {
        const id = randomUUID()
        return new Document(id, clientId, documentName, new DocumentNumber(documentNumber))
    }

    public static restore(documentId: string, clientId: string, documentName: string, documentNumber: string): Document {
        return new Document(documentId, clientId, documentName, new DocumentNumber(documentNumber))
    }
}