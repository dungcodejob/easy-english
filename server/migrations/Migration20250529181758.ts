import { Migration } from '@mikro-orm/migrations';

export class Migration20250529181758 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "role" text check ("role" in ('USER', 'ADMIN')) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "account" ("id" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "refresh_token" varchar(255) null, "password_hash" varchar(255) not null, "version" int not null, "password_updated_at" timestamptz not null default CURRENT_TIMESTAMP, "is_active" boolean not null, "last_login_at" timestamptz null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "user_id" varchar(255) null, "tenant_id" varchar(255) null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`alter table "account" add constraint "account_username_unique" unique ("username");`);
    this.addSql(`alter table "account" add constraint "account_email_unique" unique ("email");`);
    this.addSql(`create index "account_tenant_id_index" on "account" ("tenant_id");`);

    this.addSql(`create table "tenant" ("id" varchar(255) not null, "name" varchar(255) not null, "slug" varchar(255) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "owner_id" varchar(255) not null, constraint "tenant_pkey" primary key ("id"));`);
    this.addSql(`alter table "tenant" add constraint "tenant_slug_unique" unique ("slug");`);
    this.addSql(`alter table "tenant" add constraint "tenant_owner_id_unique" unique ("owner_id");`);

    this.addSql(`alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);
    this.addSql(`alter table "account" add constraint "account_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on delete cascade;`);

    this.addSql(`alter table "tenant" add constraint "tenant_owner_id_foreign" foreign key ("owner_id") references "account" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account" drop constraint "account_user_id_foreign";`);

    this.addSql(`alter table "tenant" drop constraint "tenant_owner_id_foreign";`);

    this.addSql(`alter table "account" drop constraint "account_tenant_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "account" cascade;`);

    this.addSql(`drop table if exists "tenant" cascade;`);
  }

}
