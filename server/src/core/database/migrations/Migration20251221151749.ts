import { Migration } from '@mikro-orm/migrations';

export class Migration20251221151749 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "word_entity" drop column "oxford_data";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "word_entity" add column "oxford_data" jsonb null;`);
  }

}
