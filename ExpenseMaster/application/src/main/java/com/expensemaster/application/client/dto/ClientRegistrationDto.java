package com.expensemaster.application.client.dto;

public record ClientRegistrationDto(
        String name,
        String fullName,
        String companyReason,
        String phoneNumber,
        String userId,
        String birthDate,
        String clientType,
        String email,
        Address address,
        Contact contact,
        Document document
) {
    public static ClientRegistrationDto with(
            final String name,
            final String fullName,
            final String companyReason,
            final String phoneNumber,
            final String userId,
            final String birthDate,
            final String clientType,
            final String email,
            final Address address,
            final Contact contact,
            final Document document
            ) {
        return new ClientRegistrationDto(name, fullName, companyReason, phoneNumber, userId, birthDate, clientType, email, address, contact, document);
    }

    @Override
    public String toString() {
        return String.format("ClientRegistrationDto(" +
                "name: %s, " +
                "fullName: %s, " +
                "phoneNumber: %s, " +
                "userId: %s, " +
                "birthDate: %s" +
                "clientType: %s" +
                "email: %s" +
                "address: %s" +
                "contact: %s" +
                "document: %s" +
                ")",
                name,
                fullName,
                phoneNumber,
                userId,
                birthDate,
                clientType,
                email,
                address,
                contact,
                document
        );
    }
}
