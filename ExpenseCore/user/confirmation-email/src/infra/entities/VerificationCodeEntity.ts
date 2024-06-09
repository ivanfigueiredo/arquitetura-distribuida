import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Code } from "../../domain/Code";
import { UserEntity } from "./UserEntity";

@Entity({ name: "verification_code" })
export class VerificationCodeEntity {
    @PrimaryColumn({ name: 'code_id', type: 'varchar', nullable: false })
    codeId: string;

    @Column({ name: 'email_verify', type: 'varchar', nullable: false })
    emailVerify: string;

    @Column({ name: 'code', type: 'varchar' })
    code: string;

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt: Date;

    @Column({ name: 'expiration_time', type: 'date', nullable: false })
    expirationTime: Date;

    @OneToOne(() => UserEntity, userEntity => userEntity.codesEntity)
    @JoinColumn({
        name: 'email_verify',
        referencedColumnName: 'email'
    })
    userEntity: UserEntity | null;

    constructor(
        codeId: string,
        emailVerify: string,
        code: string,
        createdAt: Date,
        expirationTime: Date,
        userEntity: UserEntity | null
    ) {
        this.codeId = codeId;
        this.emailVerify = emailVerify;
        this.code = code;
        this.createdAt = createdAt;
        this.expirationTime = expirationTime;
        this.userEntity = userEntity;

    }

    public static from(code: Code): VerificationCodeEntity {
        return new VerificationCodeEntity(code.id, code.emailVerify, code.code, new Date(), code.expirationTime, null)
    }

    public toDomain(): Code {
        return Code.restore(this.codeId, this.code, this.emailVerify, this.expirationTime);
    }

}