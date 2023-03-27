CREATE DATABASE Cocoa;
USE Cocoa;


CREATE TABLE flyer (
idflyer INT NOT NULL AUTO_INCREMENT,
type VARCHAR(100) NULL,
name VARCHAR(100) NULL,
PRIMARY KEY (idflyer)
);

CREATE TABLE event(
idevent INT NOT NULL AUTO_INCREMENT,
name VARCHAR(100) NULL,
theme VARCHAR(100) NULL,
eventdate datetime,
idflyer INT NOT NULL,
PRIMARY KEY (idevent),
FOREIGN KEY (idflyer) REFERENCES flyer(idflyer)
);

CREATE TABLE image (
idimage INT NOT NULL AUTO_INCREMENT,
type VARCHAR(100) NULL,
name VARCHAR(100) NULL,
idevent INT NOT NULL,
PRIMARY KEY (idimage),
FOREIGN KEY (idevent) REFERENCES event(idevent)
);



