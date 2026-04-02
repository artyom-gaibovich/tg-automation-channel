import { TranscriptionRepository } from '../repositories';
import { UseCasePort } from '../../presentation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListTranscriptionUseCase {
  constructor(private readonly transcriptionRepository: TranscriptionRepository) {}

  async execute(): Promise<UseCasePort.GetTranscriptionList.Output> {
    return {
      content: await this.transcriptionRepository.findAll(),
    };
  }
}
