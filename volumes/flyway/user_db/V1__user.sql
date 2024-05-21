CREATE TABLE "user_type" (
    user_type_id VARCHAR(36) NOT NULL PRIMARY KEY,
    type VARCHAR(15) NOT NULL UNIQUE
);

CREATE TABLE "user" (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    user_type VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_user_type FOREIGN KEY (user_type) REFERENCES user_type (type)
);