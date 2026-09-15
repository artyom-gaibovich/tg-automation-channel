import { TranscriptionRepository } from '../repositories';
import { UseCasePort } from '../../presentation';
import { Injectable } from '@nestjs/common';
import type { JsonValue } from '../../../shared/types';

@Injectable()
export class GetTranscriptionUseCase {
  constructor(private readonly transcriptionRepository: TranscriptionRepository) {}

  async execute(
    input: UseCasePort.GetOneTranscription.Input,
  ): Promise<UseCasePort.GetOneTranscription.Output> {
    const { transcriptionId, textOnly } = input;

    const transcription = await this.transcriptionRepository.findById(transcriptionId);

    if (!textOnly) {
      return transcription;
    }

    return { ...transcription, content: this.toPlainText(transcription.content) };
  }

  private toPlainText(content: JsonValue): JsonValue {
    const data = content as { transcription?: Array<{ text?: string }> } | null;

    if (!data || !Array.isArray(data.transcription)) {
      return content;
    }

    return {
      ...data,
      transcription: data.transcription.map((item) => item?.text ?? '').join(' '),
    };
  }
}
