import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  DeleteTranscriptionUseCase,
  GetTranscriptionUseCase,
  ListTranscriptionUseCase,
  GeneratePromptUseCase,
  UpdateTranscriptionUseCase,
} from '../../application';
import { GetTranscriptionFormatter } from '../formatter';
import { TranscriptionApiContracts } from '../api-contracts';

@Controller('transcription')
export class TranscriptionController {
  constructor(
    private readonly generatePromptUseCase: GeneratePromptUseCase,
    private readonly getTranscriptionListUseCase: ListTranscriptionUseCase,
    private readonly getTranscriptionFormatter: GetTranscriptionFormatter,
    private readonly getOneTranscriptionUseCase: GetTranscriptionUseCase,
    private readonly updateTranscriptionUseCase: UpdateTranscriptionUseCase,
    private readonly deleteTranscriptionUseCase: DeleteTranscriptionUseCase,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async generatePrompt(
    @Body() dto: TranscriptionApiContracts.Api.GetTranscription.Request.Body,
  ): Promise<TranscriptionApiContracts.Api.GetTranscription.Response.Data> {
    const { transcriptionId, audience_level, language, topic_tags, variants, categoryId } = dto;
    return {
      message: this.getTranscriptionFormatter.format(
        await this.generatePromptUseCase.execute({
          transcriptionId,
          audience_level,
          language,
          topic_tags,
          variants,
          categoryId,
        }),
      ),
    };
  }

  @Post('list')
  async getTranscriptions(): Promise<TranscriptionApiContracts.Api.Filter.Response.Data> {
    return this.getTranscriptionListUseCase.execute();
  }

  @Get(':id')
  async findOne(
    @Param('id') transcriptionId: string,
  ): Promise<TranscriptionApiContracts.Api.GetOneTranscription.Response.Data> {
    return this.getOneTranscriptionUseCase.execute({ transcriptionId });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePartial(
    @Param()
    params: TranscriptionApiContracts.Api.PatchTranscription.Request.Params,
    @Body() dto: TranscriptionApiContracts.Api.PatchTranscription.Request.Body,
  ): Promise<TranscriptionApiContracts.Api.PatchTranscription.Response.Data> {
    return this.updateTranscriptionUseCase.execute({
      id: params.id,
      data: dto,
    });
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async delete(
    @Param()
    params: TranscriptionApiContracts.Api.DeleteTranscription.Request.Params,
  ): Promise<TranscriptionApiContracts.Api.DeleteTranscription.Response.Data> {
    await this.deleteTranscriptionUseCase.execute({ id: params.id });
    return { success: true };
  }
}
