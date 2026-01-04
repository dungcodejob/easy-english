import { ImportResult } from '@app/domain/dictionary';
import { DictionarySource } from '@app/entities';
import { ImportProviderFactory } from '@app/infrastructure/dictionary';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportService {
  constructor(private readonly factory: ImportProviderFactory) {}

  async import(
    keyword: string,
    source: DictionarySource = DictionarySource.AZVOCAB,
  ): Promise<ImportResult> {
    const provider = this.factory.getProvider(source);
    return provider.import(keyword);
  }
}
