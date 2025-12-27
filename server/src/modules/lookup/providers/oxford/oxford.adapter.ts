import { DictionarySource, Language } from '@app/entities';
import { Injectable, Logger } from '@nestjs/common';
import { NormalizedData } from '../../models/lookup-result.model';
import { DictionaryAdapter } from '../dictionary.adapter';
@Injectable()
export class OxfordAdapter implements DictionaryAdapter {
  private readonly logger = new Logger(OxfordAdapter.name);

  adapt(raw: any): NormalizedData | null {
    if (!raw || !raw.results || !raw.results.length) {
      this.logger.warn('Invalid Oxford raw data for normalization');
      return null;
    }

    try {
      const entry = raw.results[0];
      const wordText = entry.word || entry.id;

      if (!wordText) {
        throw new Error('Word text missing in Oxford raw data');
      }

      const normalized: NormalizedData = {
        word: {
          text: wordText,
          normalizedText: wordText.toLowerCase().trim(),
          language: Language.EN,
        },
        pronunciations: [],
        senses: [],
      };

      // Extract Pronunciations from all lexical entries
      if (Array.isArray(entry.lexicalEntries)) {
        entry.lexicalEntries.forEach((lexicalEntry: any) => {
          const pronunciations =
            lexicalEntry.entries?.[0]?.pronunciations || [];
          pronunciations.forEach((pron: any) => {
            if (pron.phoneticSpelling || pron.audioFile) {
              normalized.pronunciations.push({
                ipa: pron.phoneticSpelling,
                audioUrl: pron.audioFile || undefined,
                region: this.inferRegion(pron),
              });
            }
          });
        });
      }

      // Extract Senses from all lexical entries
      if (Array.isArray(entry.lexicalEntries)) {
        entry.lexicalEntries.forEach((lexicalEntry: any) => {
          const partOfSpeech = lexicalEntry.lexicalCategory?.text || 'unknown';
          const entries = lexicalEntry.entries || [];

          entries.forEach((entryData: any) => {
            const senses = entryData.senses || [];
            senses.forEach((sense: any, index: number) => {
              const definitions = sense.definitions || [];
              if (definitions.length > 0) {
                const definition = definitions[0];
                normalized.senses.push({
                  partOfSpeech: partOfSpeech,
                  definition: definition,
                  shortDefinition: definition.substring(0, 100),
                  examples: sense.examples?.map((ex: any) => ex.text) || [],
                  synonyms: sense.synonyms?.map((syn: any) => syn.text) || [],
                  antonyms: sense.antonyms?.map((ant: any) => ant.text) || [],
                  senseIndex: index,
                  source: DictionarySource.OXFORD,
                });
              }
            });
          });
        });
      }

      return normalized;
    } catch (error) {
      this.logger.error(
        `Oxford adaptation failed: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  private inferRegion(pronunciation: any): string | undefined {
    // Oxford API may have dialect labels
    if (pronunciation.dialects && pronunciation.dialects.length > 0) {
      const dialect = pronunciation.dialects[0];
      if (dialect.includes('American')) return 'US';
      if (dialect.includes('British')) return 'UK';
    }
    // Fallback to audioFile pattern
    if (pronunciation.audioFile) {
      if (pronunciation.audioFile.includes('_us_')) return 'US';
      if (pronunciation.audioFile.includes('_gb_')) return 'UK';
    }
    return undefined;
  }
}
