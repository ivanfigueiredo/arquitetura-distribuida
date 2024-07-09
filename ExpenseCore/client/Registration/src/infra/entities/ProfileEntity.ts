import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { ClientEntity } from "./ClientEntity";

@Entity({ name: 'profile' })
export class ProfileEntity {
    @PrimaryColumn({ name: 'client_id', type: 'varchar', nullable: false })
    clientId: string

    @Column({ name: 'full_name', type: 'varchar', nullable: true })
    fullName?: string

    @Column({ name: 'phone_number', type: 'varchar', nullable: false })
    phoneNumber: string

    @Column({ name: 'birthdate', type: 'date', nullable: true })
    birthdate?: string

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updatedAt: Date;

    @OneToOne(() => ClientEntity, clientEntity => clientEntity.profileEntity)
    @JoinColumn({
        name: 'client_id',
        referencedColumnName: 'clientId'
    })
    clientEntity: ClientEntity | null

    constructor(
        clientId: string,
        fullName: string | undefined,
        phoneNumber: string,
        birthdate: string | undefined,
        createdAt: Date,
        updatedAt: Date,
        clientEntity: ClientEntity | null
    ) {
        this.clientId = clientId
        this.fullName = fullName
        this.phoneNumber = phoneNumber
        this.birthdate = birthdate
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.clientEntity = clientEntity
    }
}