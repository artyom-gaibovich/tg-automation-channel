import {
  TRANSCRIPTION_SORTABLE_FIELDS,
  TranscriptionRepository,
  TranscriptionSortField,
} from '../repositories';
import { UseCasePort } from '../../presentation';
import { BadRequestException, Injectable } from '@nestjs/common';

const DEFAULT_ORDER_BY = { field: 'createdAt', direction: 'desc' } as const;

@Injectable()
export class ListTranscriptionUseCase {
  constructor(private readonly transcriptionRepository: TranscriptionRepository) {}

  async execute(
    input: UseCasePort.GetTranscriptionList.Input,
  ): Promise<UseCasePort.GetTranscriptionList.Output> {
    const { page, size, codes } = input;
    const [{ items, total }, distinctCodes] = await Promise.all([
      this.transcriptionRepository.findPage({
        skip: page * size,
        take: size,
        orderBy: this.parseSort(input.sort),
        codes,
      }),
      this.transcriptionRepository.findDistinctCodes(),
    ]);

    return {
      content: items,
      page,
      size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
      codes: distinctCodes,
    };
  }

  private parseSort(sort?: string): {
    field: TranscriptionSortField;
    direction: 'asc' | 'desc';
  } {
    if (!sort) {
      return DEFAULT_ORDER_BY;
    }
    const [field, direction] = sort.split(',');
    if (!TRANSCRIPTION_SORTABLE_FIELDS.includes(field as TranscriptionSortField)) {
      throw new BadRequestException(
        `Sort by "${field}" is not supported. Allowed fields: ${TRANSCRIPTION_SORTABLE_FIELDS.join(', ')}`,
      );
    }
    return {
      field: field as TranscriptionSortField,
      direction: direction === 'asc' ? 'asc' : 'desc',
    };
  }
}
