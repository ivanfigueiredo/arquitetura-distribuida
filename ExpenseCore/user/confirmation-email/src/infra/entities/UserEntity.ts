import { Column, Entity, OneToOne, PrimaryColumn, Unique } from "typeorm";
import { User } from "../../domain/User";
import { VerificationCodeEntity } from "./VerificationCodeEntity";

@Entity({ name: 'user' })
@Unique(['email'])
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

    @OneToOne(() => VerificationCodeEntity, codesEntity => codesEntity.userEntity)
    codesEntity: VerificationCodeEntity | null

    constructor(
        userId: string,
        email: string,
        password: string,
        userType: string,
        emailVerified: boolean,
        createdAt: Date,
        updatedAt: Date,
        codesEntity: VerificationCodeEntity | null
    ) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.codesEntity = codesEntity;
        this.emailVerified = emailVerified;
    }

    public static from(user: User): UserEntity {
        return new UserEntity(
            user.userId,
            user.email,
            user.password.value,
            user.userType,
            user.getEmailVerified,
            new Date(),
            new Date(),
            VerificationCodeEntity.from(user.codeVerification)
        );
    }

    public toDomain(): User {
        return User.restore(this.userId, this.email, this.emailVerified, this.password, this.userType, this.codesEntity!.toDomain())
    }
}