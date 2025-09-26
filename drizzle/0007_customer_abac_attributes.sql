ALTER TABLE "users" ADD COLUMN "customer_type" varchar(50);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "customer_tier" varchar(50);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "customer_since" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "customer_status" varchar(50);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "customer_segment" varchar(50);