import { DictionarySource, Language } from '@app/entities';
import { Injectable, Logger } from '@nestjs/common';
import { NormalizedData } from '../dictionary-normalizer.service';

@Injectable()
export class FreeDictionaryAdapter {
  private readonly logger = new Logger(FreeDictionaryAdapter.name);

  adapt(raw: any): NormalizedData | null {
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
      this.logger.warn('Invalid raw data for normalization');
      return null;
    }

    try {
      const entry = raw[0]; // Take the first entry
      const wordText = entry.word;

      if (!wordText) {
        throw new Error('Word text missing in raw data');
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

      // Extract Pronunciations
      if (Array.isArray(entry.phonetics)) {
        normalized.pronunciations = entry.phonetics
          .filter((p: any) => p.text || p.audio)
          .map((p: any) => ({
            ipa: p.text,
            audioUrl: p.audio || undefined,
            region: this.inferRegion(
              typeof p.audio === 'string' ? (p.audio as string) : undefined,
            ),
          }));
      }

      // Extract Senses
      if (Array.isArray(entry.meanings)) {
        entry.meanings.forEach((meaning: any) => {
          const partOfSpeech = meaning.partOfSpeech;
          const definitions = meaning.definitions;
          const globalSynonyms = meaning.synonyms || [];
          const globalAntonyms = meaning.antonyms || [];

          if (Array.isArray(definitions)) {
            definitions.forEach((def: any, index: number) => {
              if (!def.definition) return;

              normalized.senses.push({
                partOfSpeech: partOfSpeech,
                definition: def.definition,
                shortDefinition: def.definition.substring(0, 100), // simplistic short def
                examples: def.example ? [def.example] : [],
                synonyms: [...globalSynonyms, ...(def.synonyms || [])],
                antonyms: [...globalAntonyms, ...(def.antonyms || [])],
                senseIndex: index,
                source: DictionarySource.DICTIONARY_API,
              });
            });
          }
        });
      }

      return normalized;
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
