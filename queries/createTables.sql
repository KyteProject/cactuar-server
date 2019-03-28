CREATE TABLE "settings"
(
  "gID" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL DEFAULT '',
  "prefix" varchar(3) NOT NULL DEFAULT '.',
  "modRole" varchar(255) NOT NULL DEFAULT 'Moderator',
  "adminRole" varchar(255) NOT NULL DEFAULT 'Administrator',
  "feedbackChannel" varchar(255) DEFAULT 'Insert channel ID',
  "delete" bool NOT NULL DEFAULT TRUE,
  "pin" bool NOT NULL DEFAULT TRUE,
  "badges" bool NOT NULL DEFAULT TRUE,
  "tokens" bool NOT NULL DEFAULT TRUE,
  "response" varchar(255) NOT NULL DEFAULT 'Have you considered giving feedback before makign a request?',
  "threshold" int2 NOT NULL DEFAULT 8,
  PRIMARY KEY ("gID")
)
WITHOUT OIDS;

CREATE TABLE "users"
(
  "jID" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL DEFAULT '',
  "level" int4 NOT NULL DEFAULT 1,
  "current" int8 NOT NULL DEFAULT 0,
  "next" int8 NOT NULL DEFAULT 83,
  "total" int8 NOT NULL DEFAULT 0,
  "tokens" int4 NOT NULL,
  "lastRequest" date,
  "submissions" int4 NOT NULL DEFAULT 0,
  "requests" int4 NOT NULL DEFAULT 0,
  "keywords" int4 NOT NULL DEFAULT 0,
  "disabled" bool NOT NULL DEFAULT FALSE,
  PRIMARY KEY ("jID")
)
WITHOUT OIDS;

CREATE TABLE "messages"
(
  "msgID" varchar(255) NOT NULL,
  "gID" varchar(255) NOT NULL,
  "authID" varchar(255) NOT NULL,
  PRIMARY KEY ("msgID")
)
WITHOUT OIDS;

CREATE TABLE "challenges" (

)
WITHOUT OIDS;

ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_settings_1" FOREIGN KEY ("gID") REFERENCES "settings" ("gID");
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_users_1" FOREIGN KEY ("authID") REFERENCES "users" ("jID");

