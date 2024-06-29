package com.expensemaster.application.client.dto;

public record Document(
        String documentType,
        String documentNumber
) {
    public static Document with(final String documentType, final String documentNumber) {
        return new Document(documentType, documentNumber);
    }
}
