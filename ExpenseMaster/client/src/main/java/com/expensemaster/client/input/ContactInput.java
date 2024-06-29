package com.expensemaster.client.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ContactInput {
    @NotNull(message = "name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 30 characters")
    private String name;

    @NotNull(message = "email is required")
    @Email(message = "Email must be valid.")
    private String email;

    @NotNull(message = "phoneNumber is required")
    private String phoneNumber;

    @NotNull(message = "relationship is required")
    private String relationship;

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRelationship() {
        return relationship;
    }

    @Override
    public String toString() {
        return String.format("ContactInput(name: %s, email: %s, phoneNumber: %s, relationship: %s)",name,email,phoneNumber,relationship);
    }
}
