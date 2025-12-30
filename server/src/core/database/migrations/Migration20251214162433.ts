import { Migration } from '@mikro-orm/migrations';

export class Migration20251214162433 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "topic_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "tenant_id" uuid not null, "name" varchar(255) not null, "description" varchar(255) null, "category" text check ("category" in ('VOCABULARY', 'GRAMMAR', 'IDIOMS', 'PHRASES', 'PRONUNCIATION', 'LISTENING', 'SPEAKING', 'READING', 'WRITING')) not null default 'VOCABULARY', "tags" text[] not null, "language_pair" varchar(255) not null, "cover_image_url" varchar(255) null, "is_public" boolean not null default false, "word_count" int not null default 0, "share_url" varchar(255) null, constraint "topic_entity_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "word_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "tenant_id" uuid not null, "word" varchar(255) not null, "definition" text null, "definitions" jsonb null, "pronunciation" varchar(255) null, "audio_url" varchar(255) null, "part_of_speech" text[] null, "examples" text[] null, "synonyms" text[] null, "antonyms" text[] null, "personal_note" text null, "media_urls" jsonb null, "difficulty" int not null default 1, "custom_fields" jsonb null, "from_oxford_api" boolean not null default false, "oxford_data" jsonb null, "review_count" int not null default 0, "last_reviewed_at" timestamptz null, "topic_id" uuid not null, constraint "word_entity_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "topic_entity" add constraint "topic_entity_tenant_id_foreign" foreign key ("tenant_id") references "tenant_entity" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "word_entity" add constraint "word_entity_tenant_id_foreign" foreign key ("tenant_id") references "tenant_entity" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "word_entity" add constraint "word_entity_topic_id_foreign" foreign key ("topic_id") references "topic_entity" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "word_entity" drop constraint "word_entity_topic_id_foreign";`,
    );

    this.addSql(`drop table if exists "topic_entity" cascade;`);

    this.addSql(`drop table if exists "word_entity" cascade;`);
  }
}
