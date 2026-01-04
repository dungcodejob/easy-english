import { Migration } from '@mikro-orm/migrations';

export class Migration20260104123416 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "word_entity_idioms" drop constraint "word_entity_idioms_idiom_entity_id_foreign";`);

    this.addSql(`alter table "word_entity_phrases" drop constraint "word_entity_phrases_phrase_entity_id_foreign";`);

    this.addSql(`alter table "word_entity_verb_phrases" drop constraint "word_entity_verb_phrases_verb_phrase_entity_id_foreign";`);

    this.addSql(`drop table if exists "idiom_entity" cascade;`);

    this.addSql(`drop table if exists "phrase_entity" cascade;`);

    this.addSql(`drop table if exists "verb_phrase_entity" cascade;`);

    this.addSql(`drop table if exists "word_entity_verb_phrases" cascade;`);

    this.addSql(`drop table if exists "word_entity_phrases" cascade;`);

    this.addSql(`drop table if exists "word_entity_idioms" cascade;`);

    this.addSql(`alter table "word_sense_entity" drop column "examples";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "idiom_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "text" text not null, "definition" text null, "definition_vi" text null, constraint "idiom_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "idiom_entity" add constraint "idiom_entity_text_unique" unique ("text");`);

    this.addSql(`create table "phrase_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "text" text not null, "definition" text null, "definition_vi" text null, constraint "phrase_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "phrase_entity" add constraint "phrase_entity_text_unique" unique ("text");`);

    this.addSql(`create table "verb_phrase_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "text" text not null, "definition" text null, "definition_vi" text null, constraint "verb_phrase_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "verb_phrase_entity" add constraint "verb_phrase_entity_text_unique" unique ("text");`);

    this.addSql(`create table "word_entity_verb_phrases" ("word_entity_id" uuid not null, "verb_phrase_entity_id" uuid not null, constraint "word_entity_verb_phrases_pkey" primary key ("word_entity_id", "verb_phrase_entity_id"));`);

    this.addSql(`create table "word_entity_phrases" ("word_entity_id" uuid not null, "phrase_entity_id" uuid not null, constraint "word_entity_phrases_pkey" primary key ("word_entity_id", "phrase_entity_id"));`);

    this.addSql(`create table "word_entity_idioms" ("word_entity_id" uuid not null, "idiom_entity_id" uuid not null, constraint "word_entity_idioms_pkey" primary key ("word_entity_id", "idiom_entity_id"));`);

    this.addSql(`alter table "word_entity_verb_phrases" add constraint "word_entity_verb_phrases_word_entity_id_foreign" foreign key ("word_entity_id") references "word_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "word_entity_verb_phrases" add constraint "word_entity_verb_phrases_verb_phrase_entity_id_foreign" foreign key ("verb_phrase_entity_id") references "verb_phrase_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "word_entity_phrases" add constraint "word_entity_phrases_word_entity_id_foreign" foreign key ("word_entity_id") references "word_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "word_entity_phrases" add constraint "word_entity_phrases_phrase_entity_id_foreign" foreign key ("phrase_entity_id") references "phrase_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "word_entity_idioms" add constraint "word_entity_idioms_word_entity_id_foreign" foreign key ("word_entity_id") references "word_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "word_entity_idioms" add constraint "word_entity_idioms_idiom_entity_id_foreign" foreign key ("idiom_entity_id") references "idiom_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "word_sense_entity" add column "examples" jsonb null;`);
  }

}
