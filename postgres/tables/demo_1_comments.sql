BEGIN TRANSACTION;

CREATE TABLE demo_1_comments (
    id serial PRIMARY KEY,
    created_by text NOT NULL,
    team text NOT NULL,
    comments text NOT NULL,
    created_at timestamp NOT NULL
);

COMMIT;