import { Column, Entity, PrimaryColumn } from "typeorm";
import { Code } from "../../domain/Code";

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

    constructor(
        codeId: string,
        emailVerify: string,
        code: string,
        createdAt: Date,
        expirationTime: Date
    ) {
        this.codeId = codeId;
        this.emailVerify = emailVerify;
        this.code = code;
        this.createdAt = createdAt;
        this.expirationTime = expirationTime;

    }

    public static from(code: Code): VerificationCodeEntity {
        return new VerificationCodeEntity(code.id, code.emailVerify, code.code, new Date(), code.expirationTime)
    }

}