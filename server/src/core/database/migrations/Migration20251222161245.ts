import { Migration } from '@mikro-orm/migrations';

export class Migration20251222161245 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "topic_entity" drop constraint if exists "topic_entity_category_check";`,
    );

    this.addSql(
      `alter table "topic_entity" add constraint "topic_entity_category_check" check("category" in ('Vocabulary', 'Grammar', 'Idioms', 'Phrases', 'Pronunciation', 'Listening', 'Speaking', 'Reading', 'Writing'));`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "topic_entity" drop constraint if exists "topic_entity_category_check";`,
    );

    this.addSql(
      `alter table "topic_entity" add constraint "topic_entity_category_check" check("category" in ('VOCABULARY', 'GRAMMAR', 'IDIOMS', 'PHRASES', 'PRONUNCIATION', 'LISTENING', 'SPEAKING', 'READING', 'WRITING'));`,
    );
  }
}
