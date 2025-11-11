import { Transcription } from '../../Domain';

export abstract class TranscriptionRepository {
  abstract findById(id: string): Promise<Transcription>;
  abstract findAll(): Promise<Omit<Transcription, 'content'>[]>;
}
