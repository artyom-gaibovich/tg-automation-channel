import { Injectable } from '@nestjs/common';
import { TranscriptionRepository } from '../Repositories';
import { IO } from '../../Presentation';

@Injectable()
export class DeleteTranscriptionUseCase {
  constructor(
    private readonly transcriptionRepository: TranscriptionRepository
  ) {}

  async execute(input: IO.DeleteTranscription.Input): Promise<void> {
    const { id } = input;
    await this.transcriptionRepository.delete(id);
  }
}
