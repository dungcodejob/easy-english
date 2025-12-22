import { QueryDto } from '@app/models';

export class GetTopicsDto extends QueryDto<
  'name' | 'category' | 'isPublic' | 'tags' | 'languagePair',
  'name' | 'category' | 'createAt' | 'updateAt' | 'wordCount'
> {}
