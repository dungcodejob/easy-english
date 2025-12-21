import { Injectable } from '@nestjs/common';
import { LookupResult } from '../models/lookup-result.model';
import { DictionaryAdapter } from './dictionary.adapter';

@Injectable()
export class OxfordAdapter implements DictionaryAdapter {
  adapt(data: any): LookupResult {
    if (!data || !data.results || !data.results.length) return null as any;

    const entry = data.results[0];
    const lexicalEntry = entry.lexicalEntries?.[0]; // Taking first lexical entry

    if (!lexicalEntry) return null as any;

    const entryData = lexicalEntry.entries?.[0];
    const sense = entryData?.senses?.[0];

    const definition = sense?.definitions?.[0];
    const examples = sense?.examples?.map((ex: any) => ex.text) || [];
    const pronunciation =
      lexicalEntry.entries?.[0]?.pronunciations?.[0]?.phoneticSpelling;
    const audioUrl = lexicalEntry.entries?.[0]?.pronunciations?.[0]?.audioFile;
    const synonyms = sense?.synonyms?.map((syn: any) => syn.text) || [];

    // Antonyms are not always readily available in this simplified parse, but can be extracted if needed
    const antonyms = sense?.antonyms?.map((ant: any) => ant.text) || [];

    const result = new LookupResult();
    result.word = entry.word || entry.id;
    result.source = 'oxford';
    result.definition = definition;
    result.examples = examples;
    result.pronunciation = pronunciation ? `/${pronunciation}/` : undefined;
    result.audioUrl = audioUrl;
    result.synonyms = synonyms;
    result.antonyms = antonyms;
    result.partOfSpeech = [lexicalEntry.lexicalCategory.text];
    result.raw = data;

    return result;
  }
}
