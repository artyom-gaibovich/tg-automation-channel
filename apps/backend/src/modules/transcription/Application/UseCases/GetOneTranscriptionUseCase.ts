import { TranscriptionRepository } from '../Repositories';
import { IO } from '../../Presentation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetOneTranscriptionUseCase {
  constructor(
    private readonly transcriptionRepository: TranscriptionRepository
  ) {}

  async execute(
    input: IO.GetOneTranscription.Input
  ): Promise<IO.GetOneTranscription.Output> {
    const { transcriptionId } = input;

    return await this.transcriptionRepository.findById(transcriptionId);
  }
}
