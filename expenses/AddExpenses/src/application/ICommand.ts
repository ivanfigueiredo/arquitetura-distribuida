export interface ICommand {
    replyTo(topic: string, payload: object): Promise<void>
}
