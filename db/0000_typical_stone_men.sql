CREATE TABLE "code" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person_code" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"code_id" uuid NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "person_code" ADD CONSTRAINT "person_code_person_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_code" ADD CONSTRAINT "person_code_code_fk" FOREIGN KEY ("code_id") REFERENCES "public"."code"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."person_code_with_value" AS (select "person_code"."id", "person_code"."person_id", "person_code"."type", "code"."value", "code"."name" from "person_code" inner join "code" on "code"."id" = "person_code"."code_id");--> statement-breakpoint
CREATE VIEW "public"."person_with_code_and_code_value" AS (select "person"."id", "person"."email", "person"."first_name", "person"."last_name", jsonb_build_object('id',"person_code"."id",'personId',"person_code"."person_id",'codeId',"person_code"."code_id",'type',"person_code"."type") as "personCode", jsonb_build_object('id',"code"."id",'value',"code"."value",'name',"code"."name") as "code" from "person" inner join "person_code" on "person_code"."person_id" = "person"."id" inner join "code" on "code"."id" = "person_code"."code_id" group by "person"."id", "person_code"."id", "code"."id");