import { ApiProperty } from '@nestjs/swagger';

export class LookupResult {
  @ApiProperty()
  word: string;

  @ApiProperty()
  source: string;

  @ApiProperty()
  definition?: string;

  @ApiProperty()
  pronunciation?: string;

  @ApiProperty()
  audioUrl?: string;

  @ApiProperty({ type: [String] })
  partOfSpeech?: string[];

  @ApiProperty({ type: [String] })
  examples?: string[];

  @ApiProperty({ type: [String] })
  synonyms?: string[];

  @ApiProperty({ type: [String] })
  antonyms?: string[];

  @ApiProperty()
  raw?: any;
}

export interface NormalizedData {
  word: {
    text: string;
    normalizedText: string;
    language: string;
  };
  pronunciations: Array<{
    ipa?: string;
    audioUrl?: string;
    region?: string;
  }>;
  senses: Array<{
    partOfSpeech: string;
    definition: string;
    shortDefinition?: string;
    examples: string[];
    synonyms: string[];
    antonyms: string[];
    senseIndex: number;
    source: string;
  }>;
}
