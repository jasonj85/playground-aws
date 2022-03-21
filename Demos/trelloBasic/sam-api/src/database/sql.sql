CREATE DATABASE trelloBasic;

CREATE TABLE trelloBasic.cards(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tableName varchar(255) NOT NULL,
    title varchar(255) NOT NULL
)