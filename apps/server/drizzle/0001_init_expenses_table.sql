CREATE TYPE "public"."expense_categories" AS ENUM('food', 'transportation', 'utilities');--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"note" varchar(50),
	"amount" integer NOT NULL,
	"owner_id" uuid NOT NULL,
	"category" "expense_categories" NOT NULL,
	"occurred_at" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;