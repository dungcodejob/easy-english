import { Filter, ParseFilters, ParseSort, Sort } from '@app/decorators';

export class GetWorkspacesDto {
  @ParseFilters()
  filters?: Filter<'name' | 'language'>[];

  @ParseSort()
  sorts?: Sort<'name' | 'language' | 'createAt' | 'updateAt'>[];
}
