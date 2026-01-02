import { Migration } from '@mikro-orm/migrations';

export class Migration20251231181041 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "word_sense_entity" drop constraint "word_sense_entity_word_id_part_of_speech_sense_in_0d610_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "word_sense_entity" add constraint "word_sense_entity_word_id_part_of_speech_sense_in_0d610_unique" unique ("word_id", "part_of_speech", "sense_index", "source");`);
  }

}
