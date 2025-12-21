import { Migration } from '@mikro-orm/migrations';

export class Migration20251221152609 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "word_cache_entity" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "word" varchar(255) not null, "source" varchar(255) not null, "raw" jsonb null, "definition" text null, "definitions" jsonb null, "pronunciation" varchar(255) null, "audio_url" varchar(255) null, "part_of_speech" text[] null, "examples" text[] null, "synonyms" text[] null, "antonyms" text[] null, "media_urls" jsonb null, "expires_at" timestamptz null, constraint "word_cache_entity_pkey" primary key ("id"));`,
    );
    this.addSql(`
      ALTER TABLE word_cache_entity
      DROP CONSTRAINT IF EXISTS word_cache_entity_word_source_unique;
    `);
    this.addSql(`
      CREATE UNIQUE INDEX word_cache_entity_word_source_active_idx
      ON word_cache_entity ("word", "source")
      WHERE delete_flag = false;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      DROP INDEX IF EXISTS word_cache_entity_word_source_active_idx;
    `);
    this.addSql(`drop table if exists "word_cache_entity" cascade;`);
  }
}
