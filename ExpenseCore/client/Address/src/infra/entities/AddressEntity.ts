import { Column, Entity, PrimaryColumn } from "typeorm";
import { Address } from "../../domain/Address";

@Entity({ name: 'address' })
export class AddressEntity {
    @PrimaryColumn({ name: 'address_id', type: 'varchar', nullable: false })
    addressId: string

    @Column({ name: 'client_id', type: 'varchar', nullable: false })
    clientId: string

    @Column({ name: 'street', type: 'varchar', nullable: false })
    street: string

    @Column({ name: 'city', type: 'varchar', nullable: false })
    city: string

    @Column({ name: 'state', type: 'varchar', nullable: false })
    state: string

    @Column({ name: 'postal_code', type: 'varchar', nullable: false })
    postalCode: string

    @Column({ name: 'country', type: 'varchar', nullable: false })
    country: string

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updatedAt: Date;

    constructor(
        addressId: string,
        clientId: string,
        street: string,
        city: string,
        state: string,
        postalCode: string,
        country: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.addressId = addressId
        this.clientId = clientId
        this.street = street
        this.city = city
        this.state = state
        this.postalCode = postalCode
        this.country = country
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }


    public static from(address: Address): AddressEntity {
        return new AddressEntity(
            address.id,
            address.clientId,
            address.street,
            address.city,
            address.state,
            address.postalCode,
            address.country,
            new Date(),
            new Date()
        )
    }

    public to(): Address {
        return Address.restore(
            this.addressId,
            this.clientId,
            this.city,
            this.street,
            this.postalCode,
            this.state,
            this.country
        )
    }
}