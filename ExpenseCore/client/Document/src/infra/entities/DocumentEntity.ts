import { Column, Entity, PrimaryColumn } from "typeorm";
import { Document } from "../../domain/Document";

@Entity({ name: 'document' })
export class DocumentEntity {
    @PrimaryColumn({ name: 'document_id', type: 'varchar', nullable: false })
    documentId: string;

    @Column({ name: 'client_id', type: 'varchar', nullable: false })
    clientId: string;

    @Column({ name: 'document_name', type: 'varchar', nullable: false })
    documentName: string;

    @Column({ name: 'document_number', type: 'varchar', nullable: false })
    documentNumber: string;

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt: Date;

    constructor(
        documentId: string,
        clientId: string,
        documentName: string,
        documentNumber: string,
        createdAt: Date,
    ) {
        this.clientId = clientId;
        this.documentId = documentId;
        this.documentName = documentName;
        this.documentNumber = documentNumber;
        this.createdAt = createdAt;

    }

    public static from(document: Document): DocumentEntity {
        return new DocumentEntity(
            document.id,
            document.clientId,
            document.documentName,
            document.documentNumber.value,
            new Date()
        )
    }

    public to(): Document {
        return Document.restore(this.documentId, this.documentId, this.documentName, this.documentNumber)
    }
}