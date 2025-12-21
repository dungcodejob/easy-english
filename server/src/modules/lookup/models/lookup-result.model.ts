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
