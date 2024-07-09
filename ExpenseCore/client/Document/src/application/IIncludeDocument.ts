import { DocumentDto } from "./dto/DocumentDto";

export interface IIncludeDocument {
    execute(dto: DocumentDto): Promise<void>
}