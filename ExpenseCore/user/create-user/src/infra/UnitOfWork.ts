import { QueryRunner } from 'typeorm';
import { IUnitOfWorkApplication } from '../application/IUnitOfWorkApplication';
import { IUnitOfWorkInfra } from './IUnitOfWorkInfra';
import { DatabaseConnection } from './DatabaseConnection';
import { UserEntity } from './entities/UserEntity';

export class UnitOfWork implements IUnitOfWorkInfra, IUnitOfWorkApplication {
  private readonly queryRunner: QueryRunner;

  public constructor(private readonly connection: DatabaseConnection) {
    this.queryRunner = this.connection.getDataSourcer().createQueryRunner();
    this.queryRunner.connect();
  }

  public async startTransaction(): Promise<void> {
    await this.queryRunner.startTransaction();
  }

  public async transaction(data: UserEntity): Promise<void> {
    await this.queryRunner.manager.save<UserEntity>(data);
  }

  public async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  public async rollBack(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  public async release(): Promise<void> {
    await this.queryRunner.release();    
  }
}
