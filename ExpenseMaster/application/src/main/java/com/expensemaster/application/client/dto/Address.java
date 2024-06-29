package com.expensemaster.application.client.dto;

public record Address(
        String state,
        String city,
        String country,
        String postalCode,
        String street
) {
    public static Address with(final String state, final String city, final String country, final String postalCode, final String street) {
        return new Address(state, city, country, postalCode, street);
    }
}
