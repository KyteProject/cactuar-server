/*
 Target Server Type    : PostgreSQL
 Target Server Version : 100006
 Target Schema         : bot
 File Encoding         : 65001
*/


-- ----------------------------
-- Table structure for challenges
-- ----------------------------
DROP TABLE IF EXISTS "bot"."challenges";
CREATE TABLE "bot"."challenges" (

)
;

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS "bot"."messages";
CREATE TABLE "bot"."messages" (
  "msg" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "guild" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "author" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS "bot"."settings";
CREATE TABLE "bot"."settings" (
  "gid" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "prefix" varchar(3) COLLATE "pg_catalog"."default" NOT NULL DEFAULT '.'::character varying,
  "mod_role" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'Moderator'::character varying,
  "admin_role" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'Administrator'::character varying,
  "feedback_channel" varchar(255) COLLATE "pg_catalog"."default" DEFAULT 'Insert channel ID'::character varying,
  "delete" bool NOT NULL DEFAULT true,
  "pin" bool NOT NULL DEFAULT true,
  "badges" bool NOT NULL DEFAULT true,
  "tokens" bool NOT NULL DEFAULT true,
  "threshold" int2 NOT NULL DEFAULT 5,
  "respond" bool NOT NULL DEFAULT true,
  "global_resources" bool NOT NULL DEFAULT false,
  "resources_channel" varchar(255) COLLATE "pg_catalog"."default" DEFAULT 'Insert channel ID'::character varying,
  "response" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'Have you considered giving feedback before makign a request?'::character varying
)
;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "bot"."users";
CREATE TABLE "bot"."users" (
  "jid" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "level" int4 NOT NULL DEFAULT 1,
  "current" int8 NOT NULL DEFAULT 0,
  "next" int8 NOT NULL DEFAULT 83,
  "total" int8 NOT NULL DEFAULT 0,
  "tokens" int4 NOT NULL DEFAULT 0,
  "last_request" varchar(255) COLLATE "pg_catalog"."default",
  "submissions" int4 NOT NULL DEFAULT 0,
  "requests" int4 NOT NULL DEFAULT 0,
  "keywords" int4 NOT NULL DEFAULT 0,
  "disabled" bool NOT NULL DEFAULT false
)
;

-- ----------------------------
-- Primary Key structure for table messages
-- ----------------------------
ALTER TABLE "bot"."messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("msg");

-- ----------------------------
-- Primary Key structure for table settings
-- ----------------------------
ALTER TABLE "bot"."settings" ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("gid");

-- ----------------------------
-- Checks structure for table users
-- ----------------------------
ALTER TABLE "bot"."users" ADD CONSTRAINT "keywords_nonnegative" CHECK ((keywords >= 0));
ALTER TABLE "bot"."users" ADD CONSTRAINT "requests_nonnegative" CHECK ((requests >= 0));
ALTER TABLE "bot"."users" ADD CONSTRAINT "submissions_nonnegative" CHECK ((submissions >= 0));
ALTER TABLE "bot"."users" ADD CONSTRAINT "tokens_nonnegative" CHECK ((tokens >= 0));
ALTER TABLE "bot"."users" ADD CONSTRAINT "total_nonnegative" CHECK ((total >= 0));
ALTER TABLE "bot"."users" ADD CONSTRAINT "next_nonnegative" CHECK ((next >= 0));
ALTER TABLE "bot"."users" ADD CONSTRAINT "current_nonnegative" CHECK ((current >= 0));
ALTER TABLE "bot"."users" ADD CONSTRAINT "level_nonnegative" CHECK ((level >= 0));

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "bot"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("jid");
