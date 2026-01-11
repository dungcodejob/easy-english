import { Migration } from '@mikro-orm/migrations';

export class Migration20260111190129 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "vocab_set_entity_examples" drop constraint "vocab_set_entity_examples_example_entity_id_foreign";`);

    this.addSql(`create table "api_response_cache" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "provider" text check ("provider" in ('azvocab', 'cambridge', 'free_dictionary')) not null, "endpoint_type" text check ("endpoint_type" in ('search', 'definition')) not null, "request_identifier" varchar(255) not null, "raw_response" jsonb not null, "response_size_bytes" int null, "status_code" int not null default 200, "latency_ms" int null, constraint "api_response_cache_pkey" primary key ("id"));`);
    this.addSql(`create index "api_response_cache_provider_request_identifier_index" on "api_response_cache" ("provider", "request_identifier");`);
    this.addSql(`alter table "api_response_cache" add constraint "api_response_cache_provider_endpoint_type_request_6b54c_unique" unique ("provider", "endpoint_type", "request_identifier");`);

    this.addSql(`create table "word_pronunciation_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "word_id" uuid not null, "ipa" varchar(255) null, "audio_url" varchar(255) null, "region" varchar(255) null, constraint "word_pronunciation_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "word_pronunciation_entity_word_id_index" on "word_pronunciation_entity" ("word_id");`);

    this.addSql(`create table "word_example_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "external_id" varchar(255) null, "sense_id" uuid not null, "text" text not null, "translation_vi" text null, "order" int not null default 0, constraint "word_example_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "word_example_entity_sense_id_index" on "word_example_entity" ("sense_id");`);

    this.addSql(`alter table "word_pronunciation_entity" add constraint "word_pronunciation_entity_word_id_foreign" foreign key ("word_id") references "word_entity" ("id") on update cascade;`);

    this.addSql(`alter table "word_example_entity" add constraint "word_example_entity_sense_id_foreign" foreign key ("sense_id") references "word_sense_entity" ("id") on update cascade;`);

    this.addSql(`drop table if exists "pronunciation_entity" cascade;`);

    this.addSql(`drop table if exists "example_entity" cascade;`);

    this.addSql(`alter table "vocab_set_entity_examples" drop constraint "vocab_set_entity_examples_pkey";`);

    this.addSql(`alter table "vocab_set_entity_examples" rename column "example_entity_id" to "word_example_entity_id";`);
    this.addSql(`alter table "vocab_set_entity_examples" add constraint "vocab_set_entity_examples_word_example_entity_id_foreign" foreign key ("word_example_entity_id") references "word_example_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "vocab_set_entity_examples" add constraint "vocab_set_entity_examples_pkey" primary key ("vocab_set_entity_id", "word_example_entity_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "vocab_set_entity_examples" drop constraint "vocab_set_entity_examples_word_example_entity_id_foreign";`);

    this.addSql(`create table "pronunciation_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "word_id" uuid not null, "ipa" varchar(255) null, "audio_url" varchar(255) null, "region" varchar(255) null, constraint "pronunciation_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "pronunciation_entity_word_id_index" on "pronunciation_entity" ("word_id");`);

    this.addSql(`create table "example_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "external_id" varchar(255) null, "sense_id" uuid not null, "text" text not null, "translation_vi" text null, "order" int not null default 0, constraint "example_entity_pkey" primary key ("id"));`);
    this.addSql(`create index "example_entity_sense_id_index" on "example_entity" ("sense_id");`);

    this.addSql(`alter table "pronunciation_entity" add constraint "pronunciation_entity_word_id_foreign" foreign key ("word_id") references "word_entity" ("id") on update cascade;`);

    this.addSql(`alter table "example_entity" add constraint "example_entity_sense_id_foreign" foreign key ("sense_id") references "word_sense_entity" ("id") on update cascade;`);

    this.addSql(`drop table if exists "api_response_cache" cascade;`);

    this.addSql(`drop table if exists "word_pronunciation_entity" cascade;`);

    this.addSql(`drop table if exists "word_example_entity" cascade;`);

    this.addSql(`alter table "vocab_set_entity_examples" drop constraint "vocab_set_entity_examples_pkey";`);

    this.addSql(`alter table "vocab_set_entity_examples" rename column "word_example_entity_id" to "example_entity_id";`);
    this.addSql(`alter table "vocab_set_entity_examples" add constraint "vocab_set_entity_examples_example_entity_id_foreign" foreign key ("example_entity_id") references "example_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "vocab_set_entity_examples" add constraint "vocab_set_entity_examples_pkey" primary key ("vocab_set_entity_id", "example_entity_id");`);
  }

}
