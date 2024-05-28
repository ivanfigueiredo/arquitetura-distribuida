import { Client } from "../domain/Client";

export interface IClientRepository {
    save(client: Client): Promise<void>
}