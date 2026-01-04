import { Migration } from '@mikro-orm/migrations';

export class Migration20260102165551 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "collection_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "external_id" varchar(255) not null, "name" varchar(255) not null, "brief" varchar(255) null, "description" text null, "image" varchar(255) null, "languages" jsonb null, constraint "collection_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "collection_entity" add constraint "collection_entity_external_id_unique" unique ("external_id");`);

    this.addSql(`create table "category_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "external_id" varchar(255) not null, "name" varchar(255) not null, "collection_id" uuid not null, constraint "category_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "category_entity_collection_id_index" on "category_entity" ("collection_id");`);
    this.addSql(`alter table "category_entity" add constraint "category_entity_external_id_unique" unique ("external_id");`);

    this.addSql(`create table "idiom_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "text" text not null, "definition" text null, "definition_vi" text null, constraint "idiom_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "idiom_entity" add constraint "idiom_entity_text_unique" unique ("text");`);

    this.addSql(`create table "phrase_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "text" text not null, "definition" text null, "definition_vi" text null, constraint "phrase_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "phrase_entity" add constraint "phrase_entity_text_unique" unique ("text");`);

    this.addSql(`create table "verb_phrase_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "text" text not null, "definition" text null, "definition_vi" text null, constraint "verb_phrase_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "verb_phrase_entity" add constraint "verb_phrase_entity_text_unique" unique ("text");`);

    this.addSql(`create table "vocab_set_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "external_id" varchar(255) not null, "name" varchar(255) not null, "category_id" uuid not null, constraint "vocab_set_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "vocab_set_entity_category_id_index" on "vocab_set_entity" ("category_id");`);
    this.addSql(`alter table "vocab_set_entity" add constraint "vocab_set_entity_external_id_unique" unique ("external_id");`);

    this.addSql(`create table "word_entity_verb_phrases" ("word_entity_id" uuid not null, "verb_phrase_entity_id" uuid not null, constraint "word_entity_verb_phrases_pkey" primary key ("word_entity_id", "verb_phrase_entity_id"));`);

    this.addSql(`create table "word_entity_phrases" ("word_entity_id" uuid not null, "phrase_entity_id" uuid not null, constraint "word_entity_phrases_pkey" primary key ("word_entity_id", "phrase_entity_id"));`);

    this.addSql(`create table "word_entity_idioms" ("word_entity_id" uuid not null, "idiom_entity_id" uuid not null, constraint "word_entity_idioms_pkey" primary key ("word_entity_id", "idiom_entity_id"));`);

    this.addSql(`create table "vocab_set_entity_senses" ("vocab_set_entity_id" uuid not null, "word_sense_entity_id" uuid not null, constraint "vocab_set_entity_senses_pkey" primary key ("vocab_set_entity_id", "word_sense_entity_id"));`);

    this.addSql(`create table "example_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "external_id" varchar(255) null, "sense_id" uuid not null, "text" text not null, "translation_vi" text null, "order" int not null default 0, constraint "example_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "example_entity_sense_id_index" on "example_entity" ("sense_id");`);

    this.addSql(`create table "vocab_set_entity_examples" ("vocab_set_entity_id" uuid not null, "example_entity_id" uuid not null, constraint "vocab_set_entity_examples_pkey" primary key ("vocab_set_entity_id", "example_entity_id"));`);

    this.addSql(`alter table "category_entity" add constraint "category_entity_collection_id_foreign" foreign key ("collection_id") references "collection_entity" ("id") on update cascade;`);

    this.addSql(`alter table "vocab_set_entity" add constraint "vocab_set_entity_category_id_foreign" foreign key ("category_id") references "category_entity" ("id") on update cascade;`);

    this.addSql(`alter table "word_entity_verb_phrases" add constraint "word_entity_verb_phrases_word_entity_id_foreign" foreign key ("word_entity_id") references "word_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "word_entity_verb_phrases" add constraint "word_entity_verb_phrases_verb_phrase_entity_id_foreign" foreign key ("verb_phrase_entity_id") references "verb_phrase_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "word_entity_phrases" add constraint "word_entity_phrases_word_entity_id_foreign" foreign key ("word_entity_id") references "word_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "word_entity_phrases" add constraint "word_entity_phrases_phrase_entity_id_foreign" foreign key ("phrase_entity_id") references "phrase_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "word_entity_idioms" add constraint "word_entity_idioms_word_entity_id_foreign" foreign key ("word_entity_id") references "word_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "word_entity_idioms" add constraint "word_entity_idioms_idiom_entity_id_foreign" foreign key ("idiom_entity_id") references "idiom_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "vocab_set_entity_senses" add constraint "vocab_set_entity_senses_vocab_set_entity_id_foreign" foreign key ("vocab_set_entity_id") references "vocab_set_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "vocab_set_entity_senses" add constraint "vocab_set_entity_senses_word_sense_entity_id_foreign" foreign key ("word_sense_entity_id") references "word_sense_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "example_entity" add constraint "example_entity_sense_id_foreign" foreign key ("sense_id") references "word_sense_entity" ("id") on update cascade;`);

    this.addSql(`alter table "vocab_set_entity_examples" add constraint "vocab_set_entity_examples_vocab_set_entity_id_foreign" foreign key ("vocab_set_entity_id") references "vocab_set_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "vocab_set_entity_examples" add constraint "vocab_set_entity_examples_example_entity_id_foreign" foreign key ("example_entity_id") references "example_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "word_entity" add column "rank" int null, add column "frequency" int null, add column "source" varchar(255) not null default 'cambridge', add column "inflects" jsonb null, add column "word_family" jsonb null, add column "update_by" varchar(255) null;`);

    this.addSql(`alter table "word_sense_entity" add column "external_id" varchar(255) null, add column "cefr_level" varchar(255) null, add column "images" jsonb null, add column "collocations" jsonb null, add column "related_words" jsonb null, add column "idioms" jsonb null, add column "phrases" jsonb null, add column "verb_phrases" jsonb null, add column "definition_vi" text null, add column "update_by" varchar(255) null;`);

    this.addSql(`alter table "user_word_sense_entity" add column "definition_vi" text null, add column "pronunciation_uk" varchar(255) null, add column "pronunciation_us" varchar(255) null, add column "audio_uk" varchar(255) null, add column "audio_us" varchar(255) null, add column "images" jsonb null, add column "collocations" jsonb null, add column "related_words" jsonb null, add column "idioms" jsonb null, add column "phrases" jsonb null, add column "verb_phrases" jsonb null, add column "cefr_level" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "category_entity" drop constraint "category_entity_collection_id_foreign";`);

    this.addSql(`alter table "vocab_set_entity" drop constraint "vocab_set_entity_category_id_foreign";`);

    this.addSql(`alter table "word_entity_idioms" drop constraint "word_entity_idioms_idiom_entity_id_foreign";`);

    this.addSql(`alter table "word_entity_phrases" drop constraint "word_entity_phrases_phrase_entity_id_foreign";`);

    this.addSql(`alter table "word_entity_verb_phrases" drop constraint "word_entity_verb_phrases_verb_phrase_entity_id_foreign";`);

    this.addSql(`alter table "vocab_set_entity_senses" drop constraint "vocab_set_entity_senses_vocab_set_entity_id_foreign";`);

    this.addSql(`alter table "vocab_set_entity_examples" drop constraint "vocab_set_entity_examples_vocab_set_entity_id_foreign";`);

    this.addSql(`alter table "vocab_set_entity_examples" drop constraint "vocab_set_entity_examples_example_entity_id_foreign";`);

    this.addSql(`drop table if exists "collection_entity" cascade;`);

    this.addSql(`drop table if exists "category_entity" cascade;`);

    this.addSql(`drop table if exists "idiom_entity" cascade;`);

    this.addSql(`drop table if exists "phrase_entity" cascade;`);

    this.addSql(`drop table if exists "verb_phrase_entity" cascade;`);

    this.addSql(`drop table if exists "vocab_set_entity" cascade;`);

    this.addSql(`drop table if exists "word_entity_verb_phrases" cascade;`);

    this.addSql(`drop table if exists "word_entity_phrases" cascade;`);

    this.addSql(`drop table if exists "word_entity_idioms" cascade;`);

    this.addSql(`drop table if exists "vocab_set_entity_senses" cascade;`);

    this.addSql(`drop table if exists "example_entity" cascade;`);

    this.addSql(`drop table if exists "vocab_set_entity_examples" cascade;`);

    this.addSql(`alter table "word_entity" drop column "rank", drop column "frequency", drop column "source", drop column "inflects", drop column "word_family", drop column "update_by";`);

    this.addSql(`alter table "word_sense_entity" drop column "external_id", drop column "cefr_level", drop column "images", drop column "collocations", drop column "related_words", drop column "idioms", drop column "phrases", drop column "verb_phrases", drop column "definition_vi", drop column "update_by";`);

    this.addSql(`alter table "user_word_sense_entity" drop column "definition_vi", drop column "pronunciation_uk", drop column "pronunciation_us", drop column "audio_uk", drop column "audio_us", drop column "images", drop column "collocations", drop column "related_words", drop column "idioms", drop column "phrases", drop column "verb_phrases", drop column "cefr_level";`);
  }

}
