package com.expensemaster.application.client.dto;

public record Contact(
        String name,
        String email,
        String phoneNumber,
        String relationship
) {
    public static Contact with(final String name, final String email, final String phoneNumber, final String relationship) {
        return new Contact(name, email, phoneNumber, relationship);
    }
}
