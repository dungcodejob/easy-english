import { WordEntity } from '@app/entities';
import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

export class WordFactory extends Factory<WordEntity> {
  model = WordEntity;

  definition(): Partial<WordEntity> {
    return {
      word: faker.word.sample(),
      definition: faker.lorem.sentence(),
      pronunciation: `/${faker.lorem.word()}/`,
      examples: [faker.lorem.sentence(), faker.lorem.sentence()],
      partOfSpeech: [faker.helpers.arrayElement(['noun', 'verb', 'adjective'])],
      difficulty: faker.number.int({ min: 1, max: 5 }),
    };
  }
}
