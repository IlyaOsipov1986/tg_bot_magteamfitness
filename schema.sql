CREATE DATABASE tg_bot_magteamfitness_app;
USE tg_bot_magteamfitness_app;

CREATE TABLE guides (
    id integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NO NULL,
    contents 
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO guides (title, contents)
VALUES