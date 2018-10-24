BEGIN TRANSACTION;

CREATE TABLE demo_teams (
    id serial PRIMARY KEY,
    team text NOT NULL,
    leader text NOT NULL,
    members text[] NOT NULL
);

COMMIT;