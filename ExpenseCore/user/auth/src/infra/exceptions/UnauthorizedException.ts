export class UnauthorizedException extends Error {
    public constructor(readonly message: string, readonly status: number) {
        super(message);
    }
}