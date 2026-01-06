import { ApiProperty } from '@nestjs/swagger';

export class PronunciationDto {
  @ApiProperty({ description: 'Region code (uk/us)', example: 'uk' })
  region: string;

  @ApiProperty({ description: 'IPA text', example: '/həˈləʊ/' })
  ipa?: string;

  @ApiProperty({ description: 'Audio URL', example: 'https://...' })
  audioUrl?: string;
}

export class ExampleDto {
  @ApiProperty({ description: 'Example sentence' })
  text: string;

  @ApiProperty({ description: 'Vietnamese translation', required: false })
  translationVi?: string;
}

export class SenseDetailDto {
  @ApiProperty({ description: 'Sense ID' })
  id: string;

  @ApiProperty({ description: 'Part of speech', example: 'noun' })
  partOfSpeech: string;

  @ApiProperty({ description: 'Definition in English' })
  definition: string;

  @ApiProperty({ description: 'Definition in Vietnamese', required: false })
  definitionVi?: string;

  @ApiProperty({ description: 'CEFR Level', required: false, example: 'B1' })
  cefrLevel?: string;

  @ApiProperty({ description: 'Images', type: [String], required: false })
  images?: string[];

  @ApiProperty({ description: 'List of examples', type: [ExampleDto] })
  examples: ExampleDto[];

  @ApiProperty({ description: 'Synonyms', type: [String], required: false })
  synonyms?: string[];

  @ApiProperty({ description: 'Antonyms', type: [String], required: false })
  antonyms?: string[];

  @ApiProperty({ description: 'Idioms', type: [String], required: false })
  idioms?: string[];

  @ApiProperty({ description: 'Phrases', type: [String], required: false })
  phrases?: string[];

  @ApiProperty({ description: 'Verb phrases', type: [String], required: false })
  verbPhrases?: string[];
}

export class WordFamilyDto {
  @ApiProperty({ description: 'Nouns', type: [String], required: false })
  n?: string[];

  @ApiProperty({ description: 'Verbs', type: [String], required: false })
  v?: string[];

  @ApiProperty({ description: 'Adjectives', type: [String], required: false })
  adj?: string[];

  @ApiProperty({ description: 'Adverbs', type: [String], required: false })
  adv?: string[];

  @ApiProperty({ description: 'Head of the family' })
  head: string;
}

export class WordDetailResponseDto {
  @ApiProperty({ description: 'Word ID' })
  id: string;

  @ApiProperty({ description: 'The word text', example: 'hello' })
  text: string;

  @ApiProperty({ description: 'Rank', required: false })
  rank?: number;

  @ApiProperty({ description: 'Frequency', required: false })
  frequency?: number;

  @ApiProperty({
    description: 'Word family',
    type: WordFamilyDto,
    required: false,
  })
  wordFamily?: WordFamilyDto;

  @ApiProperty({ description: 'Pronunciations', type: [PronunciationDto] })
  pronunciations: PronunciationDto[];

  @ApiProperty({ description: 'Senses', type: [SenseDetailDto] })
  senses: SenseDetailDto[];
}
