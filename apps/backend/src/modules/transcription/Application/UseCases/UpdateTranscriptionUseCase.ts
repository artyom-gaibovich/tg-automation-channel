import { Injectable } from '@nestjs/common';
import { TranscriptionRepository } from '../Repositories';
import { IO } from '../../Presentation';

@Injectable()
export class UpdateTranscriptionUseCase {
  constructor(
    private readonly transcriptionRepository: TranscriptionRepository
  ) {}

  async execute(
    input: IO.UpdateTranscription.Input
  ): Promise<IO.UpdateTranscription.Output> {
    const { id, data } = input;

    return await this.transcriptionRepository.updatePartial(id, data);
  }
}
