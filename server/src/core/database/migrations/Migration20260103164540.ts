import { Migration } from '@mikro-orm/migrations';

export class Migration20260103164540 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "topic_senses" ("id" uuid not null default uuidv7(), "create_at" timestamptz not null default current_timestamp, "update_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "delete_flag" boolean not null default false, "topic_id" uuid not null, "word_sense_id" uuid not null, "personal_note" text null, "personal_examples" jsonb null, "definition_vi" text null, "custom_images" jsonb null, "difficulty_rating" int null, "tags" jsonb null, "order_index" int not null default 0, "learning_status" text check ("learning_status" in ('new', 'learning', 'reviewing', 'mastered')) not null default 'new', "last_review_at" date null, "review_count" int not null default 0, "ease_factor" numeric(10,0) not null default 2.5, "interval" int not null default 0, "next_review_at" date null, constraint "topic_senses_pkey" primary key ("id"));`);
    this.addSql(`create index "topic_senses_topic_id_index" on "topic_senses" ("topic_id");`);
    this.addSql(`create index "topic_senses_word_sense_id_index" on "topic_senses" ("word_sense_id");`);
    this.addSql(`alter table "topic_senses" add constraint "topic_senses_topic_id_word_sense_id_unique" unique ("topic_id", "word_sense_id");`);

    this.addSql(`alter table "topic_senses" add constraint "topic_senses_topic_id_foreign" foreign key ("topic_id") references "topic_entity" ("id") on update cascade;`);
    this.addSql(`alter table "topic_senses" add constraint "topic_senses_word_sense_id_foreign" foreign key ("word_sense_id") references "word_sense_entity" ("id") on update cascade;`);

    this.addSql(`alter table "user_word_sense_entity" drop constraint "user_word_sense_entity_user_id_word_part_of_speech_unique";`);

    this.addSql(`alter table "user_word_sense_entity" add column "is_custom_word" boolean not null default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "topic_senses" cascade;`);

    this.addSql(`alter table "user_word_sense_entity" drop column "is_custom_word";`);

    this.addSql(`alter table "user_word_sense_entity" add constraint "user_word_sense_entity_user_id_word_part_of_speech_unique" unique ("user_id", "word", "part_of_speech");`);
  }

}
