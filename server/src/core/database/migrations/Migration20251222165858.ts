import { Migration } from '@mikro-orm/migrations';

export class Migration20251222165858 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "topic_entity" add column "user_id" varchar(255) not null;`,
    );
    this.addSql(
      `alter table "topic_entity" add constraint "topic_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "topic_entity" drop constraint "topic_entity_user_id_foreign";`,
    );

    this.addSql(`alter table "topic_entity" drop column "user_id";`);
  }
}
