CREATE TABLE "client_type" (
    client_type_id VARCHAR(36) NOT NULL PRIMARY KEY,
    type VARCHAR(2) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "client" (
    client_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NULL,
    company_reason VARCHAR(255) NULL,
    client_type VARCHAR(2) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_client_type FOREIGN KEY (client_type) REFERENCES client_type (type)
);

CREATE TABLE "document_name" (
    document_name_id VARCHAR(36) NOT NULL PRIMARY KEY,
    document_name VARCHAR(4) NOT NULL UNIQUE
);

CREATE TABLE "document" (
    document_id VARCHAR(36) NOT NULL PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    document_name VARCHAR(4) NOT NULL,
    document_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_document_name FOREIGN KEY (document_name) REFERENCES document_name (document_name),
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES client (client_id)
);

CREATE TABLE "profile" (
    client_id VARCHAR(36) NOT NULL PRIMARY KEY,
    full_name VARCHAR(255) NULL,
    phone_number VARCHAR(255) NOT NULL,
    birthdate DATE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES client (client_id)
);

CREATE TABLE "country" (
    country_id VARCHAR(36) NOT NULL PRIMARY KEY,
    acronym VARCHAR(2) NOT NULL UNIQUE,
    country_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "states" (
    state_id VARCHAR(36) NOT NULL PRIMARY KEY,
    acronym VARCHAR(2) NOT NULL UNIQUE,
    state_name VARCHAR(255) NOT NULL UNIQUE,
    country_id VARCHAR(36) NOT NULL,

    CONSTRAINT fk_country FOREIGN KEY (country_id) REFERENCES country (country_id)
);

CREATE TABLE "city" (
    city_id VARCHAR(36) NOT NULL PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    state_acronym VARCHAR(2) NOT NULL,

    CONSTRAINT fk_acronym FOREIGN KEY (state_acronym) REFERENCES states (acronym)
);

CREATE TABLE "address" (
    address_id VARCHAR(36) NOT NULL PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,


    CONSTRAINT fk_country FOREIGN KEY (country) REFERENCES country (acronym),
    CONSTRAINT fk_state FOREIGN KEY (state) REFERENCES states (acronym),
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES client (client_id)
);

CREATE TABLE "relationship_types" (
    relationship_id VARCHAR(36) NOT NULL PRIMARY KEY,
    type VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "contact" (
    client_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    relationship VARCHAR(255) NOT NULL,

    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES client (client_id),
    CONSTRAINT fk_relationship FOREIGN KEY (relationship) REFERENCES relationship_types (type)
);