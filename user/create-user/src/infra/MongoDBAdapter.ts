import { Collection, MongoClient } from "mongodb";
import { DatabaseConnection } from "./DatabaseConnection";

export class MongoDBAdapter implements DatabaseConnection {
    private connection: MongoClient;

    constructor() {
        this.connection = new MongoClient('mongodb://ROOT:ROOT@mongo:27017/Test?authSource=admin', {monitorCommands: true});
    }

    async close(): Promise<void> {
        await this.connection.close();
    }

    async getCollection(collection: string): Promise<Collection> {
        return this.connection.db().collection(collection);
    }
    
}