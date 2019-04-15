CREATE TABLE "settings"
(
  "gid" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL DEFAULT '',
  "prefix" varchar(3) NOT NULL DEFAULT '.',
  "mod_role" varchar(255) NOT NULL DEFAULT 'Moderator',
  "admin_role" varchar(255) NOT NULL DEFAULT 'Administrator',
  "feedback_channel" varchar(255) DEFAULT 'Insert channel ID',
  "delete" bool NOT NULL DEFAULT TRUE,
  "pin" bool NOT NULL DEFAULT TRUE,
  "badges" bool NOT NULL DEFAULT TRUE,
  "tokens" bool NOT NULL DEFAULT TRUE,
  "threshold" int2 NOT NULL DEFAULT 5,
  "respond" bool NOT NULL DEFAULT TRUE,
  "global_resources" bool NOT NULL DEFAULT FALSE,
  "resources_channel" varchar(255) DEFAULT 'Insert channel ID',
  "response" varchar(255) NOT NULL DEFAULT 'Have you considered giving feedback before makign a request?',
  PRIMARY KEY ("gid")
)
WITHOUT OIDS;

CREATE TABLE "users"
(
  "jid" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL DEFAULT '',
  "level" int4 NOT NULL DEFAULT 1,
  constraint level_nonnegative check (level >= 0),
  "current" int8 NOT NULL DEFAULT 0,
  constraint current_nonnegative check (current >= 0),
  "next" int8 NOT NULL DEFAULT 83,
  constraint next_nonnegative check (next >= 0),
  "total" int8 NOT NULL DEFAULT 0,
  constraint total_nonnegative check (total >= 0),
  "tokens" int4 NOT NULL DEFAULT 0,
  constraint tokens_nonnegative check (tokens >= 0),
  "last_request" date,
  "submissions" int4 NOT NULL DEFAULT 0,
  constraint submissions_nonnegative check (submissions >= 0),
  "requests" int4 NOT NULL DEFAULT 0,
  constraint requests_nonnegative check (requests >= 0),
  "keywords" int4 NOT NULL DEFAULT 0,
  constraint keywords_nonnegative check (keywords >= 0),
  "disabled" bool NOT NULL DEFAULT FALSE,
  PRIMARY KEY ("jid")
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

ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_settings_1" FOREIGN KEY ("gid") REFERENCES "settings" ("gid");
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_users_1" FOREIGN KEY ("authid") REFERENCES "users" ("jid");

