export class DocumentDto {
    constructor(
        readonly clientId: string,
        readonly documentName: string,
        readonly documentNumber: string
    ) { }
}