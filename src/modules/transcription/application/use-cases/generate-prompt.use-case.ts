import { CategoryRepository, TranscriptionRepository } from '../repositories';
import { UseCasePort } from '../../presentation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratePromptUseCase {
  constructor(
    private readonly transcriptionRepository: TranscriptionRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: UseCasePort.GetTranscription.Input,
  ): Promise<UseCasePort.GetTranscription.Output> {
    const { transcriptionId, audience_level, variants, categoryId, topic_tags, language } = input;

    const category = await this.categoryRepository.findById(categoryId);

    const transcription = await this.transcriptionRepository.findById(transcriptionId);

    return {
      prompt: category.prompt,
      language,
      title: transcription.fileName,
      topic_tags: topic_tags,
      transcription: transcription?.content,
      audience_level,
      variants,
    };
  }
}
