import { TranscriptionRepository } from '../Repositories';
import { IO } from '../../Presentation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTranscriptionListUseCase {
  constructor(
    private readonly transcriptionRepository: TranscriptionRepository
  ) {}

  async execute(): Promise<IO.GetTranscriptionList.Output> {
    return {
      content: await this.transcriptionRepository.findAll(),
    };
  }
}
