import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_permissions" AS ENUM('content.read', 'content.update', 'feedback.read', 'feedback.update');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'read', 'replied', 'archived');
  CREATE TYPE "public"."enum_site_settings_about_social_links_platform" AS ENUM('github', 'twitter', 'linkedin', 'instagram');
  CREATE TYPE "public"."enum_site_settings_footer_social_links_platform" AS ENUM('email', 'github', 'twitter', 'linkedin', 'instagram');
  CREATE TABLE "users_permissions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_permissions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" varchar,
  	"image_url" varchar NOT NULL,
  	"href" varchar DEFAULT '#',
  	"external_url" varchar,
  	"published_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"canonical_url" varchar,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"status" "enum_projects_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar,
  	"cover_image_url" varchar NOT NULL,
  	"reading_time" varchar,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"avatar_url" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"status" "enum_testimonials_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_submissions_status" DEFAULT 'new' NOT NULL,
  	"source" varchar DEFAULT 'website',
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"testimonials_id" integer,
  	"contact_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_header_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_bento_stack_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "site_settings_experience_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"company" varchar,
  	"role" varchar,
  	"period" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "site_settings_about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_about_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_about_social_links_platform",
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_footer_main_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_footer_work_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_footer_social_links_platform",
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_logo_text" varchar,
  	"header_cta_label" varchar,
  	"header_cta_href" varchar,
  	"hero_badge_label" varchar NOT NULL,
  	"hero_badge_text" varchar NOT NULL,
  	"hero_badge_href" varchar NOT NULL,
  	"hero_availability_label" varchar,
  	"hero_headline_prefix" varchar NOT NULL,
  	"hero_headline_accent" varchar NOT NULL,
  	"hero_headline_suffix" varchar NOT NULL,
  	"hero_headline_subline" varchar NOT NULL,
  	"hero_intro_prefix" varchar NOT NULL,
  	"hero_name" varchar NOT NULL,
  	"hero_role" varchar NOT NULL,
  	"hero_email" varchar NOT NULL,
  	"hero_avatar_url" varchar NOT NULL,
  	"hero_primary_cta_label" varchar NOT NULL,
  	"hero_primary_cta_href" varchar NOT NULL,
  	"hero_secondary_cta_label" varchar NOT NULL,
  	"hero_secondary_cta_href" varchar NOT NULL,
  	"hero_focus_label" varchar,
  	"hero_focus_text" varchar,
  	"bento_build_eyebrow" varchar,
  	"bento_build_text" varchar,
  	"bento_build_href" varchar,
  	"bento_stack_eyebrow" varchar,
  	"bento_stack_text" varchar,
  	"bento_projects_eyebrow" varchar,
  	"bento_projects_value" varchar,
  	"bento_projects_text" varchar,
  	"bento_workflow_eyebrow" varchar,
  	"bento_workflow_text" varchar,
  	"bento_workflow_href" varchar,
  	"bento_experience_eyebrow" varchar,
  	"bento_experience_value" varchar,
  	"experience_eyebrow" varchar,
  	"experience_title" varchar,
  	"home_projects_eyebrow" varchar,
  	"home_projects_title" varchar,
  	"home_projects_archive_cta_label" varchar,
  	"home_projects_archive_cta_href" varchar,
  	"home_blog_eyebrow" varchar,
  	"home_blog_title" varchar,
  	"home_blog_description" varchar,
  	"home_blog_archive_cta_label" varchar,
  	"home_blog_archive_cta_href" varchar,
  	"about_eyebrow" varchar,
  	"about_title_prefix" varchar,
  	"about_title_muted" varchar,
  	"about_image_url" varchar,
  	"about_image_alt" varchar,
  	"testimonials_section_eyebrow" varchar,
  	"testimonials_section_title" varchar,
  	"tech_stack_eyebrow" varchar,
  	"tech_stack_title" varchar,
  	"tech_stack_description" varchar,
  	"tech_stack_skills_eyebrow" varchar,
  	"tech_stack_skills_title" varchar,
  	"tech_stack_tools_eyebrow" varchar,
  	"tech_stack_tools_title" varchar,
  	"cta_is_enabled" boolean DEFAULT true,
  	"cta_avatar_letter" varchar,
  	"cta_title_prefix" varchar,
  	"cta_title_accent" varchar,
  	"cta_title_middle" varchar,
  	"cta_title_suffix" varchar,
  	"cta_name" varchar,
  	"cta_availability" varchar,
  	"cta_description" varchar,
  	"cta_primary_cta_label" varchar,
  	"cta_primary_cta_href" varchar,
  	"contact_eyebrow" varchar,
  	"contact_title" varchar,
  	"contact_description" varchar,
  	"contact_submit_label" varchar,
  	"footer_brand_initial" varchar,
  	"footer_brand_name" varchar,
  	"footer_description" varchar,
  	"footer_copyright_name" varchar,
  	"projects_page_back_label" varchar,
  	"projects_page_back_href" varchar,
  	"projects_page_eyebrow" varchar,
  	"projects_page_title" varchar,
  	"projects_page_description" varchar,
  	"projects_page_footer_cta_label" varchar,
  	"projects_page_footer_cta_href" varchar,
  	"blog_page_back_label" varchar,
  	"blog_page_back_href" varchar,
  	"blog_page_eyebrow" varchar,
  	"blog_page_title" varchar,
  	"blog_page_description" varchar,
  	"blog_page_footer_cta_label" varchar,
  	"blog_page_footer_cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tags" ADD CONSTRAINT "projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_header_nav_links" ADD CONSTRAINT "site_settings_header_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_bento_stack_tags" ADD CONSTRAINT "site_settings_bento_stack_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_experience_items" ADD CONSTRAINT "site_settings_experience_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_paragraphs" ADD CONSTRAINT "site_settings_about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_social_links" ADD CONSTRAINT "site_settings_about_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_main_links" ADD CONSTRAINT "site_settings_footer_main_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_work_links" ADD CONSTRAINT "site_settings_footer_work_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_social_links" ADD CONSTRAINT "site_settings_footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_permissions_order_idx" ON "users_permissions" USING btree ("order");
  CREATE INDEX "users_permissions_parent_idx" ON "users_permissions" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "projects_tags_order_idx" ON "projects_tags" USING btree ("_order");
  CREATE INDEX "projects_tags_parent_id_idx" ON "projects_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "testimonials_slug_idx" ON "testimonials" USING btree ("slug");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_header_nav_links_order_idx" ON "site_settings_header_nav_links" USING btree ("_order");
  CREATE INDEX "site_settings_header_nav_links_parent_id_idx" ON "site_settings_header_nav_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_bento_stack_tags_order_idx" ON "site_settings_bento_stack_tags" USING btree ("_order");
  CREATE INDEX "site_settings_bento_stack_tags_parent_id_idx" ON "site_settings_bento_stack_tags" USING btree ("_parent_id");
  CREATE INDEX "site_settings_experience_items_order_idx" ON "site_settings_experience_items" USING btree ("_order");
  CREATE INDEX "site_settings_experience_items_parent_id_idx" ON "site_settings_experience_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_paragraphs_order_idx" ON "site_settings_about_paragraphs" USING btree ("_order");
  CREATE INDEX "site_settings_about_paragraphs_parent_id_idx" ON "site_settings_about_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_social_links_order_idx" ON "site_settings_about_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_about_social_links_parent_id_idx" ON "site_settings_about_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_main_links_order_idx" ON "site_settings_footer_main_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_main_links_parent_id_idx" ON "site_settings_footer_main_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_work_links_order_idx" ON "site_settings_footer_work_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_work_links_parent_id_idx" ON "site_settings_footer_work_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_social_links_order_idx" ON "site_settings_footer_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_social_links_parent_id_idx" ON "site_settings_footer_social_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_permissions" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "projects_tags" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_header_nav_links" CASCADE;
  DROP TABLE "site_settings_bento_stack_tags" CASCADE;
  DROP TABLE "site_settings_experience_items" CASCADE;
  DROP TABLE "site_settings_about_paragraphs" CASCADE;
  DROP TABLE "site_settings_about_social_links" CASCADE;
  DROP TABLE "site_settings_footer_main_links" CASCADE;
  DROP TABLE "site_settings_footer_work_links" CASCADE;
  DROP TABLE "site_settings_footer_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_permissions";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_contact_submissions_status";
  DROP TYPE "public"."enum_site_settings_about_social_links_platform";
  DROP TYPE "public"."enum_site_settings_footer_social_links_platform";`)
}
