ALTER TABLE "app"."Cast" RENAME COLUMN "id" TO "hash";--> statement-breakpoint
ALTER TABLE "app"."Cast" RENAME COLUMN "content" TO "text";--> statement-breakpoint
ALTER TABLE "app"."Cast" ADD COLUMN "created_at" timestamp;