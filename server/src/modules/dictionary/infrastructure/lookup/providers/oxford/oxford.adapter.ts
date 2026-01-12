import { DictionarySource, Language } from '@app/entities';
import { Injectable, Logger } from '@nestjs/common';
import { Word } from '../../../../domain/models/word';

@Injectable()
export class OxfordAdapter {
  private readonly logger = new Logger(OxfordAdapter.name);

  /**
   * Convert raw Oxford API response to Word domain model
   */
  toWordDomain(raw: unknown): Word | null {
    const data = raw as {
      results?: { word?: string; id?: string; lexicalEntries?: unknown[] }[];
    };
    if (!data || !data.results || !data.results.length) {
      this.logger.warn('Invalid Oxford raw data for normalization');
      return null;
    }

    try {
      const entry = data.results[0];
      const wordText = entry.word || entry.id;

      if (!wordText) {
        throw new Error('Word text missing in Oxford raw data');
      }

      // Create Word aggregate
      // Create Word aggregate
      const word = Word.createExternal({
        text: wordText,
        normalizedText: wordText.toLowerCase().trim(),
        language: Language.EN,
        source: DictionarySource.OXFORD,
      });

      // Add Pronunciations
      if (Array.isArray(entry.lexicalEntries)) {
        for (const lexicalEntry of entry.lexicalEntries as any[]) {
          const pronunciations =
            lexicalEntry.entries?.[0]?.pronunciations || [];
          for (const pron of pronunciations) {
            if (pron.phoneticSpelling || pron.audioFile) {
              word.addPronunciation({
                ipa: pron.phoneticSpelling,
                audioUrl: pron.audioFile || undefined,
                region: this.inferRegion(pron),
              });
            }
          }
        }
      }

      // Add Senses
      let senseIndex = 0;
      if (Array.isArray(entry.lexicalEntries)) {
        for (const lexicalEntry of entry.lexicalEntries as any[]) {
          const partOfSpeech = lexicalEntry.lexicalCategory?.text || 'unknown';
          const entries = lexicalEntry.entries || [];

          for (const entryData of entries) {
            const senses = entryData.senses || [];
            for (const sense of senses) {
              const definitions = sense.definitions || [];
              if (definitions.length > 0) {
                const definition = definitions[0];
                const wordSense = word.addSense({
                  partOfSpeech,
                  definition,
                  senseIndex: senseIndex++,
                  source: DictionarySource.OXFORD,
                  shortDefinition: definition.substring(0, 100),
                  synonyms: sense.synonyms?.map((syn: any) => syn.text) || [],
                  antonyms: sense.antonyms?.map((ant: any) => ant.text) || [],
                });

                // Add examples
                for (const ex of sense.examples || []) {
                  wordSense.addExample({ text: ex.text });
                }
              }
            }
          }
        }
      }

      return word;
    } catch (error) {
      this.logger.error(
        `Oxford adaptation failed: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  private inferRegion(pronunciation: any): string | undefined {
    if (pronunciation.dialects && pronunciation.dialects.length > 0) {
      const dialect = pronunciation.dialects[0];
      if (dialect.includes('American')) return 'US';
      if (dialect.includes('British')) return 'UK';
    }
    if (pronunciation.audioFile) {
      if (pronunciation.audioFile.includes('_us_')) return 'US';
      if (pronunciation.audioFile.includes('_gb_')) return 'UK';
    }
    return undefined;
  }
}
