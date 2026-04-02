import { Module, Provider } from '@nestjs/common';

import {
  CategoryRepository,
  DeleteTranscriptionUseCase,
  GetTranscriptionUseCase,
  ListTranscriptionUseCase,
  GeneratePromptUseCase,
  TranscriptionRepository,
  UpdateTranscriptionUseCase,
} from './application';
import { CategoryPrismaRepository, TranscriptionPrismaRepository } from './infrastructure';
import {
  GetTranscriptionFormatter,
  JsonGetTranscriptionFormatter,
  TranscriptionController,
} from './presentation';

const application: Provider[] = [
  GeneratePromptUseCase,
  ListTranscriptionUseCase,
  GetTranscriptionUseCase,
  UpdateTranscriptionUseCase,
  DeleteTranscriptionUseCase,
];
const infrastructure: Provider[] = [
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
  providers: [...infrastructure, ...application],
  controllers: [TranscriptionController],
})
export class TranscriptionModule {}
