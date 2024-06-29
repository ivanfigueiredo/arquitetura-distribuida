package com.expensemaster.client.input;

import jakarta.validation.constraints.NotNull;

public class DocumentInput {
    @NotNull(message = "documentName is required")
    private String documentName;
    @NotNull(message = "documentNumber is required")
    private String documentNumber;

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getDocumentName() {
        return documentName;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    @Override
    public String toString() {
        return String.format("DocumentInput(documentName: %s, documentNumber: %s)",documentName,documentNumber);
    }
}
