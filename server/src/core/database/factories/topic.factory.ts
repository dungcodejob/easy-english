import { TopicCategory, TopicEntity } from '@app/entities';
import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

export class TopicFactory extends Factory<TopicEntity> {
  model = TopicEntity;

  definition(): Partial<TopicEntity> {
    return {
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      category: faker.helpers.arrayElement(Object.values(TopicCategory)),
      languagePair: 'en-vi',
      tags: [faker.lorem.word(), faker.lorem.word()],
      isPublic: faker.datatype.boolean(),
      wordCount: faker.number.int({ min: 0, max: 20 }),
      coverImageUrl: faker.image.urlLoremFlickr({ category: 'education' }),
    };
  }
}
