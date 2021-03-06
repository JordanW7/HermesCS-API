BEGIN TRANSACTION;

CREATE TABLE demo_users (
    id serial PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text UNIQUE NOT NULL,
    hash varchar(100) NOT NULL,
    access text NOT NULL,
    status text NOT NULL,
    forgotcode text,
    team text NOT NULL
);

COMMIT;