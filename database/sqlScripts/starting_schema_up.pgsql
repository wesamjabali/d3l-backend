CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.users (
	createdAt timestamptz NOT NULL default NOW(),
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    username text NOT NULL UNIQUE,
	email text NOT NULL UNIQUE,
	password text NOT NULL,
	payRate NUMERIC(4,2) NOT NULL,
	roles text[]
);

CREATE TABLE IF NOT EXISTS public.sessions (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
	userID BIGINT,
	inTime timestamptz NOT NULL default NOW(),
	outTime timestamptz,
	createdAt timestamptz NOT NULL default NOW(),
	payRate NUMERIC(4,2) NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_user
		FOREIGN KEY(userID) 
			REFERENCES users(id)
);
