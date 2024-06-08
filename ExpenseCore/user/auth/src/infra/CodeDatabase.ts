import { Repository } from "typeorm";
import { ICodeRepository } from "../application/ICodeRepository";
import { Code } from "../domain/Code";
import { VerificationCodeEntity } from "./entities/VerificationCodeEntity";
import { DatabaseConnection } from "./DatabaseConnection";

export class CodeDatabase implements ICodeRepository {
    private readonly repository: Repository<VerificationCodeEntity>;

    constructor(private readonly connection: DatabaseConnection) {
        this.repository = this.connection.getDataSourcer().getRepository(VerificationCodeEntity);
    }

    async save(code: Code): Promise<void> {
        try {
            await this.repository.save(VerificationCodeEntity.from(code))
        } catch (error: any) {
            console.log('=================>>>> ERROR', error);
        }
    }
}