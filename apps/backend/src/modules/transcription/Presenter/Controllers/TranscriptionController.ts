import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetTranscriptionUseCase } from '../../Application';
import { GetTranscriptionFormatter } from '../Formatter';
import { TranscriptionApiContracts } from '../ApiContracts';

@Controller('transcription')
export class TranscriptionController {
  constructor(
    private readonly getTranscriptionUseCase: GetTranscriptionUseCase
  ) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async getTranscription(
    @Body() dto: TranscriptionApiContracts.Api.GetTranscription.Request.Body
  ): Promise<TranscriptionApiContracts.Api.GetTranscription.Response.Data> {
    const {
      transcriptionId,
      audience_level,
      language,
      topic_tags,
      variants,
      categoryId,
    } = dto;
    return {
      message: GetTranscriptionFormatter.format(
        await this.getTranscriptionUseCase.execute({
          transcriptionId,
          audience_level,
          language,
          topic_tags,
          variants,
          categoryId,
        })
      ),
    };
  }
}
