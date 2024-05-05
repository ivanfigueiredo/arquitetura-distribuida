export interface IUsecase1 {
    execute(): Promise<void>
}

export class Usecase1 implements IUsecase1 {
    async execute(): Promise<void> {
        console.log('====================>>>> Usecase 1')   
    }
}