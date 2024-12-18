CREATE DATABASE tg_bot_magteamfitness_app;
USE tg_bot_magteamfitness_app;

CREATE TABLE guides (
    id integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    mainGuide BOOLEAN DEFAULT FALSE,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO guides (title, contents)
VALUES

CREATE TABLE users (
    user_id integer,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    activeAdmin BOOLEAN DEFAULT 0 NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);
