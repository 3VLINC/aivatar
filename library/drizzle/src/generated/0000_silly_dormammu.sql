CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."Cast" (
	"id" varchar PRIMARY KEY NOT NULL,
	"fid" bigint,
	"content" varchar
);
--> statement-breakpoint
CREATE TABLE "app"."User" (
	"fid" bigint PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."Webhook" (
	"id" varchar PRIMARY KEY NOT NULL,
	"fid" bigint,
	"type" varchar
);
