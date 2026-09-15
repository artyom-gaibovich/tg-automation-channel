import type { TranscriptionEntity, TranscriptionListItem } from '../../domain';

export const TRANSCRIPTION_SORTABLE_FIELDS = [
  'fileName',
  'code',
  'section',
  'order',
  'createdAt',
] as const;

export type TranscriptionSortField = (typeof TRANSCRIPTION_SORTABLE_FIELDS)[number];

export interface TranscriptionPageParams {
  skip: number;
  take: number;
  orderBy: {
    field: TranscriptionSortField;
    direction: 'asc' | 'desc';
  };
  codes?: string[];
}

export abstract class TranscriptionRepository {
  abstract findById(id: string): Promise<TranscriptionEntity>;
  abstract findPage(
    params: TranscriptionPageParams,
  ): Promise<{ items: TranscriptionListItem[]; total: number }>;

  abstract findDistinctCodes(): Promise<string[]>;
  abstract updatePartial(
    id: string,
    data: Partial<Omit<TranscriptionEntity, 'id'>>,
  ): Promise<TranscriptionEntity>;

  abstract delete(id: string): Promise<void>;
}