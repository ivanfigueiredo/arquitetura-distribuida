import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { ClientEntity } from "./ClientEntity";

@Entity({ name: 'contact' })
export class ContactEntity {
    @PrimaryColumn({ name: 'client_id', type: 'varchar', nullable: false })
    clientId: string

    @Column({ name: 'name', type: 'varchar', nullable: false })
    name: string

    @Column({ name: 'email', type: 'varchar', nullable: false })
    email: string

    @Column({ name: 'phone_number', type: 'date', nullable: false })
    phoneNumber: string

    @Column({ name: 'relationship', type: 'date', nullable: false })
    relationship: string

    @OneToOne(() => ClientEntity, clientEntity => clientEntity.contactEntity)
    @JoinColumn({
        name: 'client_id',
        referencedColumnName: 'clientId'
    })
    clientEntity: ClientEntity | null

    constructor(
        clientId: string,
        name: string,
        phoneNumber: string,
        email: string,
        relationship: string,
        clientEntity: ClientEntity | null
    ) {
        this.clientId = clientId
        this.name = name
        this.email = email
        this.phoneNumber = phoneNumber
        this.relationship = relationship
        this.clientEntity = clientEntity
    }
}