import { DictionarySource, Language } from '@app/entities';
import { Injectable, Logger } from '@nestjs/common';
import { Word } from '../../../../domain/models/word';

@Injectable()
export class FreeDictionaryAdapter {
  private readonly logger = new Logger(FreeDictionaryAdapter.name);

  /**
   * Convert raw FreeDictionary API response to Word domain model
   */
  toWordDomain(raw: unknown): Word | null {
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
      this.logger.warn('Invalid raw data for normalization');
      return null;
    }

    try {
      const entry = raw[0];
      const wordText = entry.word;

      if (!wordText) {
        throw new Error('Word text missing in raw data');
      }

      // Create Word aggregate
      // Create Word aggregate
      const word = Word.createExternal({
        text: wordText,
        normalizedText: wordText.toLowerCase().trim(),
        language: Language.EN,
        source: DictionarySource.DICTIONARY_API,
      });

      // Add Pronunciations
      if (Array.isArray(entry.phonetics)) {
        for (const p of entry.phonetics) {
          if (p.text || p.audio) {
            word.addPronunciation({
              ipa: p.text,
              audioUrl: p.audio || undefined,
              region: this.inferRegion(
                typeof p.audio === 'string' ? p.audio : undefined,
              ),
            });
          }
        }
      }

      // Add Senses
      if (Array.isArray(entry.meanings)) {
        let senseIndex = 0;
        for (const meaning of entry.meanings) {
          const partOfSpeech = meaning.partOfSpeech;
          const definitions = meaning.definitions;
          const globalSynonyms = meaning.synonyms || [];
          const globalAntonyms = meaning.antonyms || [];

          if (Array.isArray(definitions)) {
            for (const def of definitions) {
              if (!def.definition) continue;

              const sense = word.addSense({
                partOfSpeech,
                definition: def.definition,
                senseIndex: senseIndex++,
                source: DictionarySource.DICTIONARY_API,
                shortDefinition: def.definition.substring(0, 100),
                synonyms: [...globalSynonyms, ...(def.synonyms || [])],
                antonyms: [...globalAntonyms, ...(def.antonyms || [])],
              });

              // Add example if exists
              if (def.example) {
                sense.addExample({ text: def.example });
              }
            }
          }
        }
      }

      return word;
    } catch (error) {
      this.logger.error(`Adaptation failed: ${error.message}`, error.stack);
      return null;
    }
  }

  private inferRegion(audioUrl?: string): string | undefined {
    if (!audioUrl) return undefined;
    if (audioUrl.includes('-us.mp3')) return 'US';
    if (audioUrl.includes('-uk.mp3')) return 'UK';
    if (audioUrl.includes('-au.mp3')) return 'AU';
    return undefined;
  }
}
