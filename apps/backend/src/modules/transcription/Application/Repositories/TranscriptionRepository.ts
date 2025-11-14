import { Transcription } from '../../Domain';

export abstract class TranscriptionRepository {
  abstract findById(id: string): Promise<Transcription>;
  abstract findAll(): Promise<Omit<Transcription, 'content'>[]>;
  abstract updatePartial(
    id: string,
    data: Partial<Omit<Transcription, 'id'>>
  ): Promise<Transcription>;

  abstract delete(id: string): Promise<void>;
}
