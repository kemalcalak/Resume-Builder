CREATE TABLE IF NOT EXISTS "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"university_name" varchar(255),
	"degree" varchar(255),
	"major" varchar(255),
	"description" text,
	"start_date" date,
	"end_date" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer,
	"title" varchar(255),
	"company_name" varchar(255),
	"city" varchar(255),
	"state" varchar(255),
	"currently_working" boolean DEFAULT false NOT NULL,
	"work_summary" text,
	"start_date" date,
	"end_date" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personal_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"job_title" varchar(255),
	"address" varchar(500),
	"phone" varchar(50),
	"email" varchar(255),
	"website" varchar(255),
	"linkedin" varchar(255),
	"github" varchar(255),
	"medium" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "theme_color" SET DEFAULT '#e11d48';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "experience" ADD CONSTRAINT "experience_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personal_info" ADD CONSTRAINT "personal_info_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
