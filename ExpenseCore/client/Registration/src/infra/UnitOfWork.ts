import { EntityTarget, ObjectLiteral, QueryRunner } from 'typeorm';
import { IUnitOfWorkApplication } from '../application/IUnitOfWorkApplication';
import { IUnitOfWorkInfra } from './IUnitOfWorkInfra';
import { DatabaseConnection } from './DatabaseConnection';
import { ClientEntity } from './entities';

export class UnitOfWork implements IUnitOfWorkInfra, IUnitOfWorkApplication {
  private readonly queryRunner: QueryRunner;

  public constructor(private readonly connection: DatabaseConnection) {
    this.queryRunner = this.connection.getDataSourcer().createQueryRunner();
    this.queryRunner.connect();
  }

  public async startTransaction(): Promise<void> {
    await this.queryRunner.startTransaction();
  }

  public async transaction<T>(data: T): Promise<void> {
    await this.queryRunner.manager.save<T>(data);
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

  public async findOne(clientId: string): Promise<ClientEntity | null> {
    return this.queryRunner.manager
      .createQueryBuilder(ClientEntity, 'client')
      .innerJoinAndSelect('client.contactEntity', 'contact')
      .innerJoinAndSelect('client.profileEntity', 'profile')
      .where('client.clientId = :clientId', { clientId })
      .getOne()
  }
}
