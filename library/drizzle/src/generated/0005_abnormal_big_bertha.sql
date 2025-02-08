ALTER TABLE "app"."Webhook" 
ALTER COLUMN "fid" SET DATA TYPE bigint[] 
USING ARRAY[fid]::bigint[];