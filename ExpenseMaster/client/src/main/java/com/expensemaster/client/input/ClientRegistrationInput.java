package com.expensemaster.client.input;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ClientRegistrationInput {
    @NotNull(message = "phoneNumber is required")
    private String phoneNumber;

    @NotNull(message = "clientType is required")
    private String clientType;

    @NotNull(message = "userId is required")
    private String userId;

    @NotNull(message = "document is required")
    private DocumentInput document;

    @NotNull(message = "address is required")
    private AddressInput address;

    @NotNull(message = "contact is required")
    private ContactInput contact;

    private String birthDate;

    @Size(min = 2, max = 100, message = "Name must be between 2 and 30 characters")
    private String name;

    @Size(min = 2, max = 100, message = "Name must be between 2 and 30 characters")
    private String fullName;

    @Size(min = 2, max = 100, message = "Name must be between 2 and 30 characters")
    private String companyReason;

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setClientType(String clientType) {
        this.clientType = clientType;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDocument(DocumentInput document) {
        this.document = document;
    }

    public void setAddress(AddressInput address) {
        this.address = address;
    }

    public void setContact(ContactInput contact) {
        this.contact = contact;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setCompanyReason(String companyReason) {
        this.companyReason = companyReason;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getClientType() {
        return clientType;
    }

    public String getUserId() {
        return userId;
    }

    public DocumentInput getDocument() {
        return document;
    }

    public AddressInput getAddress() {
        return address;
    }

    public ContactInput getContact() {
        return contact;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public String getName() {
        return name;
    }

    public String getFullName() {
        return fullName;
    }

    public String getCompanyReason() {
        return companyReason;
    }

    @Override
    public String toString() {
        return String.format("ClientRegistrationInput(" +
                "name: %s, " +
                "fullName: %s, " +
                "companyReason: %s, " +
                "birthDate: %s, " +
                "clientType: %s, " +
                "userId: %s, " +
                "document: %s, " +
                "address: %s" +
                "contact: %s" +
                ")"
                ,name,
                fullName,
                companyReason,
                birthDate,
                clientType,
                userId,
                document,
                address,
                contact
        );
    }
}
