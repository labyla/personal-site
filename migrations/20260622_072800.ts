import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_kind" AS ENUM('file', 'folder');
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_media_kind" DEFAULT 'file' NOT NULL,
  	"name" varchar,
  	"parent_id" integer,
  	"slug" varchar,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_url" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "media" ADD CONSTRAINT "media_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_parent_idx" ON "media" USING btree ("parent_id");
  CREATE UNIQUE INDEX "media_path_idx" ON "media" USING btree ("path");
  CREATE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";
  ALTER TABLE "media" DROP CONSTRAINT "media_parent_id_fk";
  DROP INDEX "payload_locked_documents_rels_media_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_id";
  DROP TABLE "media" CASCADE;
  DROP TYPE "public"."enum_media_kind";`)
}
