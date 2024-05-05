export interface IUsecase2 {
    execute(): Promise<void>
}

export class Usecase2 implements IUsecase2 {
    async execute(): Promise<void> {
        console.log('==================>>>>> Usecase 2')
    }
}