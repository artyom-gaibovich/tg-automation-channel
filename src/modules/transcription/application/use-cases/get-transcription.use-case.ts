import { TranscriptionRepository } from '../repositories';
import { UseCasePort } from '../../presentation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTranscriptionUseCase {
  constructor(private readonly transcriptionRepository: TranscriptionRepository) {}

  async execute(
    input: UseCasePort.GetOneTranscription.Input,
  ): Promise<UseCasePort.GetOneTranscription.Output> {
    const { transcriptionId } = input;

    return await this.transcriptionRepository.findById(transcriptionId);
  }
}
