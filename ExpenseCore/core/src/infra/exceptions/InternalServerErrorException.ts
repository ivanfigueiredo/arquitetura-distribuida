export class InternalServerErrorException extends Error {
    public constructor(readonly message: string, readonly status: number) {
        super(message);
    }
}