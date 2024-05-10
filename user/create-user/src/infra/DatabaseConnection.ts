import { Collection } from "mongodb";

export interface DatabaseConnection {
    close(): Promise<void>;
    getCollection(collection: string): Promise<Collection>; 
}