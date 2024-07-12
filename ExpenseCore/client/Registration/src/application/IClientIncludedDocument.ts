import { ClientIncludedDocumentDto } from "./dto/ClientIncludedDocumentDto";

export interface IClientIncludedDocument {
    execute(dto: ClientIncludedDocumentDto): Promise<void>
}