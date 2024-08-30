export class DomainException extends Error {
    readonly status: number = 422

    public constructor(readonly message: string) {
        super(message);
    }
}