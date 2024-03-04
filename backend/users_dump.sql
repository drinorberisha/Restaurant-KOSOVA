PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
    user_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT    NOT NULL,
    last_name  TEXT    NOT NULL,
    username   TEXT    UNIQUE
                       NOT NULL,
    password   TEXT    NOT NULL,
    card_uid   TEXT    UNIQUE,
    role       TEXT    NOT NULL,
    status     TEXT    NOT NULL
                       DEFAULT 'passive'
);
INSERT INTO users VALUES(1,'Admin','User','admin','6996',NULL,'admin','active');
INSERT INTO users VALUES(2,'Drinor','Berisha','drberisha','1234',NULL,'waiter','active');
INSERT INTO users VALUES(3,'Erjon','Hasanaj','ehasanaj','1111',NULL,'waiter','active');
INSERT INTO users VALUES(4,'Hasan','Berisha','bolja','2222',NULL,'manager','active');
INSERT INTO users VALUES(5,'Drinor','Admin','dradmin','4444',NULL,'admin','active');
COMMIT;
