import { Module, Provider } from '@nestjs/common';

import {
  CategoryRepository,
  DeleteTranscriptionUseCase,
  GetTranscriptionUseCase,
  ListTranscriptionUseCase,
  GeneratePromptUseCase,
  TranscribeYoutubeUseCase,
  DownloadYoutubeAudioUseCase,
  TranscriptionRepository,
  UpdateTranscriptionUseCase,
  YoutubeJobStore,
} from './application';
import {
  CategoryPrismaRepository,
  TranscriptionPrismaRepository,
  YoutubeDownloaderService,
} from './infrastructure';
import {
  GetTranscriptionFormatter,
  JsonGetTranscriptionFormatter,
  TranscriptionController,
} from './presentation';
import { FilesModule } from '../files/files.module';

const application: Provider[] = [
  GeneratePromptUseCase,
  ListTranscriptionUseCase,
  GetTranscriptionUseCase,
  UpdateTranscriptionUseCase,
  DeleteTranscriptionUseCase,
  TranscribeYoutubeUseCase,
  DownloadYoutubeAudioUseCase,
  YoutubeJobStore,
];
const infrastructure: Provider[] = [
  YoutubeDownloaderService,
  {
    provide: CategoryRepository,
    useClass: CategoryPrismaRepository,
  },
  {
    provide: TranscriptionRepository,
    useClass: TranscriptionPrismaRepository,
  },
  {
    provide: GetTranscriptionFormatter,
    useClass: JsonGetTranscriptionFormatter,
  },
];

@Module({
  imports: [FilesModule],
  providers: [...infrastructure, ...application],
  controllers: [TranscriptionController],
})
export class TranscriptionModule {}
