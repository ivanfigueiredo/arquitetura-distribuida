export class InternalServerErrorException extends Error {
    readonly status: number = 500

    public constructor(readonly message: string) {
        super(message);
    }
}