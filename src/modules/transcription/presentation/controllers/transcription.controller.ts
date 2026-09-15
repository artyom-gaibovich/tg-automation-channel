import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { createReadStream, statSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import path from 'path';
import type { Response } from 'express';
import {
  DeleteTranscriptionUseCase,
  DownloadYoutubeAudioUseCase,
  GetTranscriptionUseCase,
  ListTranscriptionUseCase,
  GeneratePromptUseCase,
  TranscribeYoutubeUseCase,
  UpdateTranscriptionUseCase,
  YoutubeJobStore,
} from '../../application';
import { GetTranscriptionFormatter } from '../formatter';
import { TranscriptionApiContracts } from '../api-contracts';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

@Controller('transcription')
export class TranscriptionController {
  private readonly logger = new Logger(TranscriptionController.name);

  constructor(
    private readonly generatePromptUseCase: GeneratePromptUseCase,
    private readonly getTranscriptionListUseCase: ListTranscriptionUseCase,
    private readonly getTranscriptionFormatter: GetTranscriptionFormatter,
    private readonly getOneTranscriptionUseCase: GetTranscriptionUseCase,
    private readonly updateTranscriptionUseCase: UpdateTranscriptionUseCase,
    private readonly deleteTranscriptionUseCase: DeleteTranscriptionUseCase,
    private readonly transcribeYoutubeUseCase: TranscribeYoutubeUseCase,
    private readonly downloadYoutubeAudioUseCase: DownloadYoutubeAudioUseCase,
    private readonly youtubeJobStore: YoutubeJobStore,
  ) {}

  /**
   * Скачивает аудио с YouTube в mp3 и отдаёт файл потоком в ответ.
   * Файл после отправки удаляется из папки uploads.
   */
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('youtube/audio')
  async downloadYoutubeAudio(
    @Body() dto: TranscriptionApiContracts.Api.DownloadYoutubeAudio.Request.Body,
    @Res() res: Response,
  ): Promise<void> {
    const { filename, originalName } = await this.downloadYoutubeAudioUseCase.execute({
      url: dto.url,
    });

    const absPath = path.join(UPLOAD_DIR, filename);
    const { size } = statSync(absPath);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', size);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(originalName)}"`,
    );
    // Чтобы фронт (другой origin через прокси) мог прочитать имя файла.
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    const cleanup = () => {
      void unlink(absPath).catch((err: Error) => {
        this.logger.error(`Failed to delete ${filename}: ${err.message}`);
      });
    };

    const stream = createReadStream(absPath);
    stream.on('error', (err) => {
      this.logger.error(`Failed to stream ${filename}: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).end();
      }
      cleanup();
    });
    // Удаляем файл после того, как ответ полностью отправлен клиенту.
    res.on('finish', cleanup);
    res.on('close', cleanup);

    stream.pipe(res);
  }

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

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('youtube')
  @HttpCode(202)
  transcribeYoutube(
    @Body() dto: TranscriptionApiContracts.Api.TranscribeYoutube.Request.Body,
  ): TranscriptionApiContracts.Api.TranscribeYoutube.Response.Data {
    const job = this.youtubeJobStore.create(dto.url);

    // Неблокирующе: запускаем загрузку+транскрибацию в фоне и сразу отвечаем.
    // Статус задачи фронт опрашивает по jobId; при ошибке она попадёт в стор.
    void this.transcribeYoutubeUseCase
      .execute({
        url: dto.url,
        code: dto.code,
        seoTags: dto.seo_tags ?? [],
      })
      .then((res) => {
        this.youtubeJobStore.setDone(job.id, res.id);
      })
      .catch((error: Error) => {
        this.logger.error(`YouTube job ${job.id} failed: ${error.message}`);
        this.youtubeJobStore.setError(job.id, error.message || 'Неизвестная ошибка');
      });

    return { jobId: job.id };
  }

  @Get('youtube/:jobId')
  @UsePipes(new ValidationPipe())
  getYoutubeJob(
    @Param() params: TranscriptionApiContracts.Api.YoutubeJobStatus.Request.Params,
  ): TranscriptionApiContracts.Api.YoutubeJobStatus.Response.Data {
    const job = this.youtubeJobStore.get(params.jobId);
    if (!job) {
      throw new NotFoundException('Задача не найдена');
    }
    return {
      status: job.status,
      error: job.error,
      transcriptionId: job.transcriptionId,
    };
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('list')
  async getTranscriptions(
    @Query() query: TranscriptionApiContracts.Api.Filter.Request.Query,
    @Body() body: TranscriptionApiContracts.Api.Filter.Request.Body,
  ): Promise<TranscriptionApiContracts.Api.Filter.Response.Data> {
    return this.getTranscriptionListUseCase.execute({
      page: query.page ?? 0,
      size: query.size ?? 20,
      sort: query.sort,
      codes: body.codes,
    });
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(
    @Param('id') transcriptionId: string,
    @Query() query: TranscriptionApiContracts.Api.GetOneTranscription.Request.Query,
  ): Promise<TranscriptionApiContracts.Api.GetOneTranscription.Response.Data> {
    return this.getOneTranscriptionUseCase.execute({
      transcriptionId,
      textOnly: query.textOnly,
    });
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
