export class ConcurrencyException extends Error {
    readonly status: number = 409

    public constructor(readonly message: string) {
        super(message);
    }
}