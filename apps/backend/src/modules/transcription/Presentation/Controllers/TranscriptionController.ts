import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetTranscriptionUseCase } from '../../Application';
import { GetTranscriptionFormatter } from '../Formatter';
import { TranscriptionApiContracts } from '../ApiContracts';
import { GetTranscriptionListUseCase } from '../../Application/UseCases/GetTranscriptionListUseCase';
import { GetOneTranscriptionUseCase } from '../../Application/UseCases/GetOneTranscriptionUseCase';

@Controller('transcription')
export class TranscriptionController {
  constructor(
    private readonly getTranscriptionUseCase: GetTranscriptionUseCase,
    private readonly getTranscriptionListUseCase: GetTranscriptionListUseCase,
    private readonly getTranscriptionFormatter: GetTranscriptionFormatter,
    private readonly getOneTranscriptionUseCase: GetOneTranscriptionUseCase
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
      message: this.getTranscriptionFormatter.format(
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

  @Post('list')
  async getTranscriptions(): Promise<TranscriptionApiContracts.Api.Filter.Response.Data> {
    return this.getTranscriptionListUseCase.execute();
  }

  @Get(':id')
  async findOne(
    @Param('id') transcriptionId: string
  ): Promise<TranscriptionApiContracts.Api.GetOneTranscription.Response.Data> {
    return this.getOneTranscriptionUseCase.execute({ transcriptionId });
  }
}
