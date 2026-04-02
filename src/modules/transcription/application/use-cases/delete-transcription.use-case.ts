import { Injectable } from '@nestjs/common';
import { TranscriptionRepository } from '../repositories';
import { UseCasePort } from '../../presentation';

@Injectable()
export class DeleteTranscriptionUseCase {
  constructor(private readonly transcriptionRepository: TranscriptionRepository) {}

  async execute(input: UseCasePort.DeleteTranscription.Input): Promise<void> {
    const { id } = input;
    await this.transcriptionRepository.delete(id);
  }
}
