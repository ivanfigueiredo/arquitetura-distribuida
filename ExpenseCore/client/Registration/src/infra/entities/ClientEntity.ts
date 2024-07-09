import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { Client } from "../../domain/Client";
import { ContactEntity } from "./ContactEntity";
import { ProfileEntity } from "./ProfileEntity";
import { Contact } from "../../domain/Contact";

@Entity({ name: 'client' })
export class ClientEntity {
    @PrimaryColumn({ name: 'client_id', type: 'varchar', nullable: false })
    clientId: string;

    @Column({ name: 'user_id', type: 'varchar', nullable: false })
    userId: string;

    @Column({ name: 'client_type', type: 'varchar', nullable: false })
    clientType: string;

    @Column({ name: 'name', type: 'varchar', nullable: true })
    name?: string;

    @Column({ name: 'email', type: 'varchar', nullable: false })
    email: string;

    @Column({ name: 'status', type: 'varchar', nullable: false })
    status: string;

    @Column({ name: 'active', type: 'boolean', nullable: false })
    active: boolean;

    @Column({ name: 'company_reason', type: 'varchar', nullable: true })
    companyReason?: string;

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updatedAt: Date;

    @OneToOne(() => ContactEntity, contactEntity => contactEntity.clientEntity)
    contactEntity: ContactEntity | null

    @OneToOne(() => ProfileEntity, profileEntity => profileEntity.clientEntity)
    profileEntity: ProfileEntity | null


    constructor(
        clientId: string,
        userId: string,
        clientType: string,
        email: string,
        status: string,
        active: boolean,
        createdAt: Date,
        updatedAt: Date,
        name: string | undefined,
        companyReason: string | undefined,
        contactEntity: ContactEntity | null,
        profileEntity: ProfileEntity | null
    ) {
        this.clientId = clientId;
        this.userId = userId;
        this.clientType = clientType;
        this.email = email;
        this.status = status;
        this.active = active;
        this.name = name;
        this.companyReason = companyReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.contactEntity = contactEntity;
        this.profileEntity = profileEntity

    }

    public static from(client: Client): ClientEntity {
        return new ClientEntity(
            client.id,
            client.userId,
            client.clientType,
            client.email,
            client.getStatus,
            client.getActive,
            new Date(),
            new Date(),
            client.name,
            client.companyReason,
            new ContactEntity(
                client.contact.clientId,
                client.contact.name,
                client.contact.phoneNumber,
                client.contact.email,
                client.contact.relationship,
                null
            ),
            new ProfileEntity(client.id, client.fullName, client.phoneNumber, client.birthDate, new Date(), new Date(), null)
        )
    }

    public to(): Client {
        return Client.restore(
            this.clientId,
            this.clientType,
            this.email,
            this.userId,
            this.profileEntity!.phoneNumber,
            this.active,
            this.status,
            Contact.restore(
                this.contactEntity!.clientId,
                this.contactEntity!.name,
                this.contactEntity!.email,
                this.contactEntity!.phoneNumber,
                this.contactEntity!.relationship
            ),
            this.name,
            this.companyReason,
            this.profileEntity?.fullName,
            this.profileEntity?.birthdate
        )
    }
}