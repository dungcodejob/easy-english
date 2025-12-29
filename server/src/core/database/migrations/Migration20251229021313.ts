import { Migration } from '@mikro-orm/migrations';

export class Migration20251229021313 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "pronunciation_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "word_id" uuid not null, "ipa" varchar(255) null, "audio_url" varchar(255) null, "region" varchar(255) null, constraint "pronunciation_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "pronunciation_entity_word_id_index" on "pronunciation_entity" ("word_id");`);

    this.addSql(`create table "word_sense_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "word_id" uuid not null, "part_of_speech" varchar(255) not null, "definition" text not null, "short_definition" text null, "examples" jsonb null, "synonyms" jsonb null, "antonyms" jsonb null, "sense_index" int not null, "source" varchar(255) not null, constraint "word_sense_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "word_sense_entity_word_id_index" on "word_sense_entity" ("word_id");`);
    this.addSql(`create index "word_sense_entity_part_of_speech_index" on "word_sense_entity" ("part_of_speech");`);
    this.addSql(`alter table "word_sense_entity" add constraint "word_sense_entity_word_id_part_of_speech_sense_in_0d610_unique" unique ("word_id", "part_of_speech", "sense_index", "source");`);

    this.addSql(`create table "user_word_sense_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "user_id" varchar(255) not null, "topic_id" uuid not null, "word" varchar(255) not null, "language" varchar(255) not null, "part_of_speech" varchar(255) not null, "definition" text not null, "examples" jsonb null, "pronunciation" varchar(255) null, "synonyms" varchar(255) null, "antonyms" varchar(255) null, "difficulty_level" text check ("difficulty_level" in ('easy', 'medium', 'hard')) not null default 'easy', "media" jsonb null, "learning_status" text check ("learning_status" in ('new', 'learning', 'reviewing', 'mastered')) not null default 'new', "last_review_at" date null, "dictionary_sense_id" uuid null, constraint "user_word_sense_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "user_word_sense_entity_user_id_index" on "user_word_sense_entity" ("user_id");`);
    this.addSql(`create index "user_word_sense_entity_topic_id_index" on "user_word_sense_entity" ("topic_id");`);
    this.addSql(`alter table "user_word_sense_entity" add constraint "user_word_sense_entity_user_id_word_part_of_speech_unique" unique ("user_id", "word", "part_of_speech");`);

    this.addSql(`alter table "pronunciation_entity" add constraint "pronunciation_entity_word_id_foreign" foreign key ("word_id") references "word_entity" ("id") on update cascade;`);

    this.addSql(`alter table "word_sense_entity" add constraint "word_sense_entity_word_id_foreign" foreign key ("word_id") references "word_entity" ("id") on update cascade;`);

    this.addSql(`alter table "user_word_sense_entity" add constraint "user_word_sense_entity_topic_id_foreign" foreign key ("topic_id") references "topic_entity" ("id") on update cascade;`);
    this.addSql(`alter table "user_word_sense_entity" add constraint "user_word_sense_entity_dictionary_sense_id_foreign" foreign key ("dictionary_sense_id") references "word_sense_entity" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "word_entity" drop constraint "word_entity_tenant_id_foreign";`);
    this.addSql(`alter table "word_entity" drop constraint "word_entity_topic_id_foreign";`);

    this.addSql(`alter table "word_cache_entity" drop column "definition", drop column "definitions", drop column "pronunciation", drop column "audio_url", drop column "part_of_speech", drop column "examples", drop column "synonyms", drop column "antonyms", drop column "media_urls";`);

    this.addSql(`alter table "word_cache_entity" alter column "raw" type jsonb using ("raw"::jsonb);`);
    this.addSql(`alter table "word_cache_entity" alter column "raw" set not null;`);

    this.addSql(`alter table "word_entity" drop column "tenant_id", drop column "definition", drop column "definitions", drop column "pronunciation", drop column "audio_url", drop column "part_of_speech", drop column "examples", drop column "synonyms", drop column "antonyms", drop column "personal_note", drop column "media_urls", drop column "difficulty", drop column "custom_fields", drop column "from_oxford_api", drop column "review_count", drop column "last_reviewed_at", drop column "topic_id";`);

    this.addSql(`alter table "word_entity" add column "normalized_text" varchar(255) not null, add column "language" varchar(255) not null default 'en';`);
    this.addSql(`alter table "word_entity" rename column "word" to "text";`);
    this.addSql(`create index "word_entity_normalized_text_index" on "word_entity" ("normalized_text");`);
    this.addSql(`alter table "word_entity" add constraint "word_entity_normalized_text_language_unique" unique ("normalized_text", "language");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_word_sense_entity" drop constraint "user_word_sense_entity_dictionary_sense_id_foreign";`);

    this.addSql(`drop table if exists "pronunciation_entity" cascade;`);

    this.addSql(`drop table if exists "word_sense_entity" cascade;`);

    this.addSql(`drop table if exists "user_word_sense_entity" cascade;`);

    this.addSql(`alter table "word_cache_entity" add column "definition" text null, add column "definitions" jsonb null, add column "pronunciation" varchar(255) null, add column "audio_url" varchar(255) null, add column "part_of_speech" text[] null, add column "examples" text[] null, add column "synonyms" text[] null, add column "antonyms" text[] null, add column "media_urls" jsonb null;`);
    this.addSql(`alter table "word_cache_entity" alter column "raw" type jsonb using ("raw"::jsonb);`);
    this.addSql(`alter table "word_cache_entity" alter column "raw" drop not null;`);

    this.addSql(`drop index "word_entity_normalized_text_index";`);
    this.addSql(`alter table "word_entity" drop constraint "word_entity_normalized_text_language_unique";`);
    this.addSql(`alter table "word_entity" drop column "normalized_text", drop column "language";`);

    this.addSql(`alter table "word_entity" add column "tenant_id" uuid not null, add column "definition" text null, add column "definitions" jsonb null, add column "pronunciation" varchar(255) null, add column "audio_url" varchar(255) null, add column "part_of_speech" text[] null, add column "examples" text[] null, add column "synonyms" text[] null, add column "antonyms" text[] null, add column "personal_note" text null, add column "media_urls" jsonb null, add column "difficulty" int not null default 1, add column "custom_fields" jsonb null, add column "from_oxford_api" boolean not null default false, add column "review_count" int not null default 0, add column "last_reviewed_at" timestamptz null, add column "topic_id" uuid not null;`);
    this.addSql(`alter table "word_entity" add constraint "word_entity_tenant_id_foreign" foreign key ("tenant_id") references "tenant_entity" ("id") on update cascade;`);
    this.addSql(`alter table "word_entity" add constraint "word_entity_topic_id_foreign" foreign key ("topic_id") references "topic_entity" ("id") on update cascade;`);
    this.addSql(`alter table "word_entity" rename column "text" to "word";`);
  }

}
