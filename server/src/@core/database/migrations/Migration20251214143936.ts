import { Migration } from '@mikro-orm/migrations';

export class Migration20251214143936 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tenant_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "name" varchar(100) not null, "slug" varchar(50) not null, "description" varchar(500) null, "status" text check ("status" in ('ACTIVE', 'SUSPENDED', 'INACTIVE')) not null, "plan" text check ("plan" in ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE')) not null, "logo_url" varchar(2048) null, "primary_color" varchar(7) null, "settings" jsonb null, "limits" jsonb null, "usage" jsonb null, "subscription_expires_at" timestamptz null, "is_active" boolean not null default true, constraint "tenant_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "tenant_entity" add constraint "tenant_entity_slug_unique" unique ("slug");`);
    this.addSql(`create index "tenant_entity_plan_index" on "tenant_entity" ("plan");`);
    this.addSql(`create index "tenant_entity_status_index" on "tenant_entity" ("status");`);
    this.addSql(`create index "tenant_entity_slug_index" on "tenant_entity" ("slug");`);
    this.addSql(`create index "tenant_entity_id_index" on "tenant_entity" ("id");`);

    this.addSql(`create table "user_entity" ("id" varchar(255) not null, "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "name" varchar(255) not null, "role" text check ("role" in ('USER', 'ADMIN')) not null, "tenant_id" uuid not null, constraint "user_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "account_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "tenant_id" uuid not null, "username" varchar(255) not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "version" int not null, "password_updated_at" timestamptz not null default CURRENT_TIMESTAMP, "is_active" boolean not null default true, "last_login_at" timestamptz null, "user_id" varchar(255) not null, constraint "account_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "account_entity" add constraint "account_entity_username_unique" unique ("username");`);
    this.addSql(`alter table "account_entity" add constraint "account_entity_email_unique" unique ("email");`);

    this.addSql(`create table "session_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "tenant_id" uuid not null, "device_id" varchar(255) not null, "expires_at" timestamptz null, "last_accessed_at" timestamptz not null default CURRENT_TIMESTAMP, "is_active" boolean not null default true, "refresh_token_hash" varchar(255) null, "refresh_count" int not null default 0, "ip_address" varchar(45) null, "user_agent" varchar(500) null, "device_type" varchar(100) null, "location" varchar(100) null, "account_id" uuid not null, "user_id" varchar(255) not null, constraint "session_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "session_entity_tenant_id_is_active_index" on "session_entity" ("tenant_id", "is_active");`);
    this.addSql(`create index "session_entity_account_id_is_active_index" on "session_entity" ("account_id", "is_active");`);
    this.addSql(`create index "session_entity_id_index" on "session_entity" ("id");`);

    this.addSql(`alter table "user_entity" add constraint "user_entity_tenant_id_foreign" foreign key ("tenant_id") references "tenant_entity" ("id") on update cascade;`);

    this.addSql(`alter table "account_entity" add constraint "account_entity_tenant_id_foreign" foreign key ("tenant_id") references "tenant_entity" ("id") on update cascade;`);
    this.addSql(`alter table "account_entity" add constraint "account_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "session_entity" add constraint "session_entity_tenant_id_foreign" foreign key ("tenant_id") references "tenant_entity" ("id") on update cascade;`);
    this.addSql(`alter table "session_entity" add constraint "session_entity_account_id_foreign" foreign key ("account_id") references "account_entity" ("id") on update cascade;`);
    this.addSql(`alter table "session_entity" add constraint "session_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity" drop constraint "user_entity_tenant_id_foreign";`);

    this.addSql(`alter table "account_entity" drop constraint "account_entity_tenant_id_foreign";`);

    this.addSql(`alter table "session_entity" drop constraint "session_entity_tenant_id_foreign";`);

    this.addSql(`alter table "account_entity" drop constraint "account_entity_user_id_foreign";`);

    this.addSql(`alter table "session_entity" drop constraint "session_entity_user_id_foreign";`);

    this.addSql(`alter table "session_entity" drop constraint "session_entity_account_id_foreign";`);

    this.addSql(`drop table if exists "tenant_entity" cascade;`);

    this.addSql(`drop table if exists "user_entity" cascade;`);

    this.addSql(`drop table if exists "account_entity" cascade;`);

    this.addSql(`drop table if exists "session_entity" cascade;`);
  }

}
