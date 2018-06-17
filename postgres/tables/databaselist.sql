BEGIN TRANSACTION;

CREATE TABLE databaselist (
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL,
    owner text NOT NULL,
    created_at timestamp NOT NULL
);

COMMIT;