export class DocumentCreatedDto {
    constructor(
        readonly id: string,
        readonly clientId: string,
        readonly documentName: string,
        readonly documentNumber: string,
    ) { }
}