package com.expensemaster.client.input;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AddressInput {
    @NotNull(message = "state is required")
    private String state;

    @NotNull(message = "city is required")
    @Size(min = 2, max = 2, message = "The acronyms for the States must be provided.")
    private String city;

    @NotNull(message = "country is required")
    @Size(min = 2, max = 2, message = "The acronym for the country must be provided.")
    private String country;

    @NotNull(message = "postalCode is required")
    private String postalCode;

    @NotNull(message = "street is required")
    private String street;

    public void setState(String state) {
        this.state = state;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getState() {
        return state;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getStreet() {
        return street;
    }

    @Override
    public String toString() {
        return String.format("AddressInput(state: %s, city: %s, country: %s, postalCode: %s, street: %s)",state,city,country,postalCode,street);
    }
}
