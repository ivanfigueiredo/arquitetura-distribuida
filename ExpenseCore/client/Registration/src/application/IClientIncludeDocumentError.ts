import { ClientIncludeDocumentErrorDto } from "./dto/ClientIncludeDocumentErrorDto";

export interface IClientIncludeDocumentError {
    execute(dto: ClientIncludeDocumentErrorDto): Promise<void>
}