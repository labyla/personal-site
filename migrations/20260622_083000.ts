import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tech_stack_items" ALTER COLUMN "icon" DROP DEFAULT;
  ALTER TABLE "tech_stack_items" ALTER COLUMN "icon" TYPE varchar USING "icon"::text;
  ALTER TABLE "tech_stack_items" ALTER COLUMN "icon" SET NOT NULL;
  DROP TYPE IF EXISTS "public"."enum_tech_stack_items_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
   CREATE TYPE "public"."enum_tech_stack_items_icon" AS ENUM('blocks', 'bot', 'braces', 'chrome', 'code2', 'container', 'database', 'fileText', 'figma', 'gitBranch', 'github', 'layers3', 'listChecks', 'mousePointer2', 'notebookTabs', 'penTool', 'search', 'send', 'server', 'terminal', 'triangle', 'wind', 'zap');
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "tech_stack_items" ALTER COLUMN "icon" DROP DEFAULT;
  ALTER TABLE "tech_stack_items" ALTER COLUMN "icon" TYPE "public"."enum_tech_stack_items_icon" USING (
    CASE
      WHEN "icon" IN ('blocks', 'bot', 'braces', 'chrome', 'code2', 'container', 'database', 'fileText', 'figma', 'gitBranch', 'github', 'layers3', 'listChecks', 'mousePointer2', 'notebookTabs', 'penTool', 'search', 'send', 'server', 'terminal', 'triangle', 'wind', 'zap')
      THEN "icon"
      ELSE 'code2'
    END
  )::"public"."enum_tech_stack_items_icon";
  ALTER TABLE "tech_stack_items" ALTER COLUMN "icon" SET DEFAULT 'code2';
  ALTER TABLE "tech_stack_items" ALTER COLUMN "icon" SET NOT NULL;`)
}
