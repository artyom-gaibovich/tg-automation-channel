import { TranscriptionEntity } from '../../domain';

export abstract class TranscriptionRepository {
  abstract findById(id: string): Promise<TranscriptionEntity>;
  abstract findAll(): Promise<Omit<TranscriptionEntity, 'content'>[]>;
  abstract updatePartial(
    id: string,
    data: Partial<Omit<TranscriptionEntity, 'id'>>,
  ): Promise<TranscriptionEntity>;

  abstract delete(id: string): Promise<void>;
}
