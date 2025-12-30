import { Migration } from '@mikro-orm/migrations';

export class Migration20251229173317 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "workspace_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "tenant_id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "language" text check ("language" in ('en')) not null, "user_id" varchar(255) not null, constraint "workspace_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "workspace_entity" add constraint "workspace_entity_name_unique" unique ("name");`);

    this.addSql(`alter table "workspace_entity" add constraint "workspace_entity_tenant_id_foreign" foreign key ("tenant_id") references "tenant_entity" ("id") on update cascade;`);

    this.addSql(`alter table "topic_entity" add column "workspace_id" uuid not null;`);
    this.addSql(`alter table "topic_entity" add constraint "topic_entity_workspace_id_foreign" foreign key ("workspace_id") references "workspace_entity" ("id") on update cascade;`);

    this.addSql(`alter table "user_word_sense_entity" add column "workspace_id" uuid not null;`);
    this.addSql(`alter table "user_word_sense_entity" add constraint "user_word_sense_entity_workspace_id_foreign" foreign key ("workspace_id") references "workspace_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "topic_entity" drop constraint "topic_entity_workspace_id_foreign";`);

    this.addSql(`alter table "user_word_sense_entity" drop constraint "user_word_sense_entity_workspace_id_foreign";`);

    this.addSql(`drop table if exists "workspace_entity" cascade;`);

    this.addSql(`alter table "topic_entity" drop column "workspace_id";`);

    this.addSql(`alter table "user_word_sense_entity" drop column "workspace_id";`);
  }

}
