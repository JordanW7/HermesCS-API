BEGIN TRANSACTION;

CREATE TABLE demo_requests (
	id serial PRIMARY KEY,
	firstname text NOT NULL,
	lastname text NOT NULL,
	account text NOT NULL,
	mobile text NOT NULL,
	home text NOT NULL,
	twitter text NOT NULL,
	facebook text NOT NULL,
	email text NOT NULL,
	address text NOT NULL,
	type text NOT NULL,
	topic text NOT NULL,
	assign_person text NOT NULL,
	assign_team text NOT NULL,
	priority text NOT NULL,
	details text NOT NULL,
	attachments text NOT NULL,
	status text NOT NULL,
	comments text NOT NULL,
	created_by text NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NOT NULL
);

COMMIT;