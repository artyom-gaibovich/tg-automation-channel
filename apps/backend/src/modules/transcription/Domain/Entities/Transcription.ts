export class Transcription {
  constructor(
    public readonly id: string,
    public readonly fileName: string | null,
    public readonly content: string | null,
    public readonly code: string | null
  ) {}

  static create(params: {
    id: string;
    fileName: string;
    content: string;
    code: string;
  }): Transcription {
    return new Transcription(
      params.id,
      params.fileName,
      params.content,
      params.code
    );
  }
}
