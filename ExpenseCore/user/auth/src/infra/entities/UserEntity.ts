import { Column, Entity, PrimaryColumn } from "typeorm";
import { User } from "../../domain/User";

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryColumn({ name: 'id', type: 'varchar' })
    userId: string;

    @Column({ name: 'email', type: 'varchar' })
    email: string;

    @Column({ name: 'password', type: 'varchar' })
    password: string;

    @Column({ name: 'user_type', type: 'varchar' })
    userType: string;

    @Column({ name: 'email_verified', type: 'boolean', nullable: false })
    emailVerified: boolean;

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updatedAt: Date;

    constructor(
        userId: string,
        email: string,
        password: string,
        userType: string,
        emailVerified: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

    }
}