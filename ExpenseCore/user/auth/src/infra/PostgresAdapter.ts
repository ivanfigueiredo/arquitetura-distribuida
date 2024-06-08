import "reflect-metadata";
import { DataSource } from "typeorm";
import { DatabaseConnection } from "./DatabaseConnection";
import { UserEntity } from "./entities/UserEntity";
import { VerificationCodeEntity } from "./entities/VerificationCodeEntity";

export class PostgresAdapter implements DatabaseConnection {
    private connection: DataSource;

    constructor() {
        this.connection = new DataSource({
            type: 'postgres',
            host: 'user_db',
            port: 5432,
            username: 'postgres_user',
            password: 'postgres_user',
            database: 'user_database',
            synchronize: false,
            entities: [UserEntity, VerificationCodeEntity]
        });
    }

    async init(): Promise<void> {
        await this.connection.initialize()
            .then(() => { })
            .catch((error) => { console.log(`Error -->> ${error}`) })
    }

    public getDataSourcer(): DataSource {
        return this.connection;
    }
}