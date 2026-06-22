import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_experience_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tech_stack_items_group" AS ENUM('skill', 'tool');
  CREATE TYPE "public"."enum_tech_stack_items_icon" AS ENUM('blocks', 'bot', 'braces', 'chrome', 'code2', 'container', 'database', 'fileText', 'figma', 'gitBranch', 'github', 'layers3', 'listChecks', 'mousePointer2', 'notebookTabs', 'penTool', 'search', 'send', 'server', 'terminal', 'triangle', 'wind', 'zap');
  CREATE TYPE "public"."enum_tech_stack_items_status" AS ENUM('draft', 'published');
  CREATE TABLE "experience_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"status" "enum_experience_items_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tech_stack_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"group" "enum_tech_stack_items_group" NOT NULL,
  	"icon" "enum_tech_stack_items_icon" DEFAULT 'code2' NOT NULL,
  	"color" varchar DEFAULT '#ffffff' NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"status" "enum_tech_stack_items_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "experience_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tech_stack_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experience_items_fk" FOREIGN KEY ("experience_items_id") REFERENCES "public"."experience_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tech_stack_items_fk" FOREIGN KEY ("tech_stack_items_id") REFERENCES "public"."tech_stack_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "experience_items_slug_idx" ON "experience_items" USING btree ("slug");
  CREATE INDEX "experience_items_updated_at_idx" ON "experience_items" USING btree ("updated_at");
  CREATE INDEX "experience_items_created_at_idx" ON "experience_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "tech_stack_items_slug_idx" ON "tech_stack_items" USING btree ("slug");
  CREATE INDEX "tech_stack_items_updated_at_idx" ON "tech_stack_items" USING btree ("updated_at");
  CREATE INDEX "tech_stack_items_created_at_idx" ON "tech_stack_items" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_experience_items_id_idx" ON "payload_locked_documents_rels" USING btree ("experience_items_id");
  CREATE INDEX "payload_locked_documents_rels_tech_stack_items_id_idx" ON "payload_locked_documents_rels" USING btree ("tech_stack_items_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_experience_items_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tech_stack_items_fk";
  DROP INDEX "payload_locked_documents_rels_experience_items_id_idx";
  DROP INDEX "payload_locked_documents_rels_tech_stack_items_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "experience_items_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tech_stack_items_id";
  DROP TABLE "experience_items" CASCADE;
  DROP TABLE "tech_stack_items" CASCADE;
  DROP TYPE "public"."enum_experience_items_status";
  DROP TYPE "public"."enum_tech_stack_items_group";
  DROP TYPE "public"."enum_tech_stack_items_icon";
  DROP TYPE "public"."enum_tech_stack_items_status";`)
}
