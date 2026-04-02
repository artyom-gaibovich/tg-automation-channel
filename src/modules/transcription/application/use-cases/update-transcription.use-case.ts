import { Injectable } from '@nestjs/common';
import { TranscriptionRepository } from '../repositories';
import { UseCasePort } from '../../presentation';

@Injectable()
export class UpdateTranscriptionUseCase {
  constructor(private readonly transcriptionRepository: TranscriptionRepository) {}

  async execute(
    input: UseCasePort.UpdateTranscription.Input,
  ): Promise<UseCasePort.UpdateTranscription.Output> {
    const { id, data } = input;

    return await this.transcriptionRepository.updatePartial(id, data);
  }
}
