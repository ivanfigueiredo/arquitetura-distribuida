import "reflect-metadata"
import { DataSource } from "typeorm"
import { DatabaseConnection } from "./DatabaseConnection"
import { ClientEntity, ContactEntity, ProfileEntity } from "./entities"

export class PostgresAdapter implements DatabaseConnection {
    private connection: DataSource

    constructor() {
        this.connection = new DataSource({
            type: 'postgres',
            host: 'client_db',
            port: 5432,
            username: 'postgres_client',
            password: 'postgres_client',
            database: 'client_database',
            synchronize: false,
            entities: [ClientEntity, ContactEntity, ProfileEntity]
        })
    }

    async init(): Promise<void> {
        await this.connection.initialize()
            .then(() => { })
            .catch((error) => { console.log(`Error -->> ${error}`) })
    }

    public getDataSourcer(): DataSource {
        return this.connection
    }
}