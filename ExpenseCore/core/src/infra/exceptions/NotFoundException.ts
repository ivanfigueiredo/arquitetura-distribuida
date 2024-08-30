export class NotFoundException extends Error {
    readonly status: number = 404

    public constructor(readonly message: string) {
        super(message);
    }
}