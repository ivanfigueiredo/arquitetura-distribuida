import { Repository } from "typeorm";
import { ICodeRepository } from "../application/ICodeRepository";
import { Code } from "../domain/Code";
import { VerificationCodeEntity } from "./entities/VerificationCodeEntity";
import { DatabaseConnection } from "./DatabaseConnection";
import { ILogger } from "expense-core";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";

export class CodeDatabase implements ICodeRepository {
    private readonly repository: Repository<VerificationCodeEntity>

    constructor(
        private readonly connection: DatabaseConnection,
        private readonly logger: ILogger
    ) {
        this.repository = this.connection.getDataSourcer().getRepository(VerificationCodeEntity)
    }

    async save(code: Code): Promise<void> {
        try {
            await this.repository.save(VerificationCodeEntity.from(code))
        } catch (error: any) {
            this.logger.error(`CodeDatabase - [save] - Error: ${error.message}`)
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
        }
    }
}