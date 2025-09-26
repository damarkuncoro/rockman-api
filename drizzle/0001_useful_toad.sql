CREATE TABLE "feature_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"slug" varchar(100) NOT NULL,
	"color" varchar(7) DEFAULT '#3B82F6',
	"icon" varchar(50) DEFAULT 'IconSettings',
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feature_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "feature_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "features" ADD CONSTRAINT "features_category_id_feature_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."feature_categories"("id") ON DELETE no action ON UPDATE no action;