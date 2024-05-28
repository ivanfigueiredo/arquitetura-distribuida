import { DataSource } from "typeorm";

export interface DatabaseConnection {
    init(): Promise<void>;
    getDataSourcer(): DataSource;
}