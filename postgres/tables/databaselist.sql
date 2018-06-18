BEGIN TRANSACTION;

CREATE TABLE databaselist (
    id serial PRIMARY KEY,
    displayname text UNIQUE NOT NULL,
    account text UNIQUE NOT NULL,
    owner text NOT NULL,
    created_at timestamp NOT NULL
);

COMMIT;