CREATE TABLE "account_type" (
    account_type_id VARCHAR(36) NOT NULL PRIMARY KEY,
    type VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE "account_status" (
    account_status_id VARCHAR(36) NOT NULL PRIMARY KEY,
    status VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE "account" (
    account_id VARCHAR(36) NOT NULL PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    account_type VARCHAR(10) NOT NULL,
    balance NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL,
    account_status VARCHAR(10) NOT NULL,
    credit_limit NUMERIC(15,2) NULL,
    withdrawal_limit NUMERIC(15,2) NULL,
    overdraft_fee NUMERIC(10,2) NULL,
    interest_rate NUMERIC(5,2) NULL,

    CONSTRAINT fk_account_type FOREIGN KEY (account_type) REFERENCES account_type (type),
    CONSTRAINT fk_account_status FOREIGN KEY (account_status) REFERENCES account_status (status)
);