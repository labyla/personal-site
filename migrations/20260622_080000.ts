import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
   CREATE TYPE "public"."enum_media_kind" AS ENUM('file', 'folder');
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "kind" "enum_media_kind" DEFAULT 'file' NOT NULL;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "parent_id" integer;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "slug" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "path" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "storage_filename" varchar;
  
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'media'
        AND column_name = 'local_path'
    ) THEN
      EXECUTE 'UPDATE "media" SET "path" = "local_path" WHERE "path" IS NULL';
    END IF;
  END $$;
  
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'media_folders'
    ) THEN
      CREATE TEMP TABLE "media_folder_map" (
        "old_id" integer PRIMARY KEY,
        "new_id" integer NOT NULL
      ) ON COMMIT DROP;
  
      WITH inserted AS (
        INSERT INTO "media" (
          "kind",
          "name",
          "slug",
          "path",
          "updated_at",
          "created_at"
        )
        SELECT
          'folder'::"public"."enum_media_kind",
          "name",
          "slug",
          "path",
          "updated_at",
          "created_at"
        FROM "media_folders"
        WHERE "path" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM "media"
            WHERE "media"."path" = "media_folders"."path"
          )
        RETURNING "id", "path"
      )
      INSERT INTO "media_folder_map" ("old_id", "new_id")
      SELECT "media_folders"."id", "inserted"."id"
      FROM "media_folders"
      JOIN "inserted" ON "inserted"."path" = "media_folders"."path";
  
      INSERT INTO "media_folder_map" ("old_id", "new_id")
      SELECT "media_folders"."id", "media"."id"
      FROM "media_folders"
      JOIN "media" ON "media"."path" = "media_folders"."path"
      ON CONFLICT ("old_id") DO NOTHING;
  
      UPDATE "media"
      SET "parent_id" = parent_map."new_id"
      FROM "media_folders"
      JOIN "media_folder_map" child_map ON child_map."old_id" = "media_folders"."id"
      JOIN "media_folder_map" parent_map ON parent_map."old_id" = "media_folders"."parent_id"
      WHERE "media"."id" = child_map."new_id";
  
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'media'
          AND column_name = 'folder_id'
      ) THEN
        EXECUTE 'UPDATE "media"
          SET "parent_id" = "media_folder_map"."new_id"
          FROM "media_folder_map"
          WHERE "media"."folder_id" = "media_folder_map"."old_id"
            AND "media"."parent_id" IS NULL';
      END IF;
    END IF;
  END $$;
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_media_folders_fk";
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_folder_id_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_media_folders_id_idx";
  DROP INDEX IF EXISTS "media_folder_idx";
  DROP INDEX IF EXISTS "media_local_path_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_folders_id";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "folder_id";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "local_path";
  DROP TABLE IF EXISTS "media_folders" CASCADE;
  
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_parent_id_fk";
  ALTER TABLE "media" ADD CONSTRAINT "media_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "media_parent_idx" ON "media" USING btree ("parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_path_idx" ON "media" USING btree ("path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "media_path_idx";
  DROP INDEX IF EXISTS "media_parent_idx";
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_parent_id_fk";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "path";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "parent_id";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "kind";
  DROP TYPE IF EXISTS "public"."enum_media_kind";`)
}
