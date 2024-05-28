import { Column, Entity, PrimaryColumn } from "typeorm";
import { User } from "../../domain/User";

@Entity({name: 'user'})
export class UserEntity {
    @PrimaryColumn({name: 'id', type: 'varchar'})
    userId: string;

    @Column({name: 'email', type: 'varchar'})
    email: string;

    @Column({name: 'password', type: 'varchar'})
    password: string;

    @Column({name: 'user_type', type: 'varchar'})
    userType: string;

    @Column({name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false})
    createdAt: Date;

    @Column({name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false})
    updatedAt: Date;

    constructor(
        userId: string,
        email: string,
        password: string,
        userType: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

    }

    public static from(user: User): UserEntity {
        return new UserEntity(user.userId, user.email, user.password.value, user.userType, new Date(), new Date());
    }
}