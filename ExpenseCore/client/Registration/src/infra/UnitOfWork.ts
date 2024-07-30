import { EntityTarget, ObjectLiteral, QueryRunner } from 'typeorm'
import { ILogger } from "expense-core"
import { IUnitOfWorkApplication } from '../application/IUnitOfWorkApplication'
import { IUnitOfWorkInfra } from './IUnitOfWorkInfra'
import { DatabaseConnection } from './DatabaseConnection'
import { ClientEntity } from './entities'
import { InternalServerErrorException } from './exceptions/InternalServerErrorException'

export class UnitOfWork implements IUnitOfWorkInfra, IUnitOfWorkApplication {
  private readonly queryRunner: QueryRunner;

  public constructor(
    private readonly connection: DatabaseConnection,
    private readonly logger: ILogger
  ) {
    this.queryRunner = this.connection.getDataSourcer().createQueryRunner();
    this.queryRunner.connect();
  }

  public async startTransaction(): Promise<void> {
    try {
      await this.queryRunner.startTransaction();
    } catch (error: any) {
      this.logger.error(`UnitOfWork - [save] - Error: ${error.message}`)
      throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
    }
  }

  public async transaction<T>(data: T): Promise<void> {
    await this.queryRunner.manager.save<T>(data)
  }

  public async delete<T extends ObjectLiteral>(entityTarget: EntityTarget<T>, criteria: { [key: string]: string }): Promise<void> {
    await this.queryRunner.manager.delete<T>(entityTarget, criteria)
  }

  public async commit(): Promise<void> {
    try {
      await this.queryRunner.commitTransaction()
    } catch (error: any) {
      this.logger.error(`UnitOfWork - [save] - Error: ${error.message}`)
      throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
    }
  }

  public async rollBack(): Promise<void> {
    await this.queryRunner.rollbackTransaction()
  }

  public async release(): Promise<void> {
    await this.queryRunner.release()
  }

  public async findOne(clientId: string): Promise<ClientEntity | null> {
    return this.queryRunner.manager
      .createQueryBuilder(ClientEntity, 'client')
      .innerJoinAndSelect('client.contactEntity', 'contact')
      .innerJoinAndSelect('client.profileEntity', 'profile')
      .where('client.clientId = :clientId', { clientId })
      .getOne()
  }
}
