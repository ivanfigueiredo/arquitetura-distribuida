import { Column, Entity, PrimaryColumn } from "typeorm";
import { Client } from "../../domain/Client";

@Entity({name: 'client'})
export class ClientEntity {
    @PrimaryColumn({name: 'client_id', type: 'varchar', nullable: false})
    clientId: string;

    @Column({name: 'user_id', type: 'varchar', nullable: false})
    userId: string;

    @Column({name: 'client_type', type: 'varchar', nullable: false})
    clientType: string;

    @Column({name: 'name', type: 'varchar', nullable: true})
    name?: string;

    @Column({name: 'company_reason', type: 'varchar', nullable: true})
    companyReason?: string;

    @Column({name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false})
    createdAt: Date;

    @Column({name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false})
    updatedAt: Date;

    constructor(
        clientId: string,
        userId: string,
        clientType: string,
        createdAt: Date,
        updatedAt: Date,
        name?: string,
        companyReason?: string,
    ) {
        this.clientId = clientId;
        this.userId = userId;
        this.clientType = clientType;
        this.name = name;
        this.companyReason = companyReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

    }

    public static from(client: Client): ClientEntity {
        return new ClientEntity(client.clientId, client.userId, client.clientType, new Date(), new Date(), client.name, client.companyReason)
    }
}