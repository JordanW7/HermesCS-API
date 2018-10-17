BEGIN TRANSACTION;

CREATE TABLE demo_requests (
	id serial PRIMARY KEY,
	firstname text,
	lastname text,
	account text,
	mobile text,
	home text,
	twitter text ,
	facebook text,
	email text,
	address text,
	type text NOT NULL,
	topic text NOT NULL,
	assign_person text,
	assign_team text NOT NULL,
	priority text NOT NULL,
	details text NOT NULL,
	status text NOT NULL,
	created_by text NOT NULL,
	created_at timestamp NOT NULL
);

COMMIT;