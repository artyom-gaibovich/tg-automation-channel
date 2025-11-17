import { JsonValue } from '@prisma/client/runtime/library';

export class Transcription {
  constructor(
    public readonly id: string,
    public readonly fileName: string | null,
    public readonly content: JsonValue,
    public readonly code: string | null,
    public readonly section: string | null
  ) {}

  static create(params: {
    id: string;
    fileName: string;
    content: JsonValue;
    code: string;
    section: string;
  }): Transcription {
    return new Transcription(
      params.id,
      params.fileName,
      params.content,
      params.code,
      params.section
    );
  }
}
