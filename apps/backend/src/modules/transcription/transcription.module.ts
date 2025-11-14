import { Module, Provider } from '@nestjs/common';

import {
  CategoryRepository,
  DeleteTranscriptionUseCase,
  GetOneTranscriptionUseCase,
  GetTranscriptionListUseCase,
  GetTranscriptionUseCase,
  TranscriptionRepository,
  UpdateTranscriptionUseCase,
} from './Application';
import {
  PrismaCategoryRepository,
  PrismaTranscriptionRepository,
} from './Inftrastructure';
import {
  GetTranscriptionFormatter,
  JsonGetTranscriptionFormatter,
  TranscriptionController,
} from './Presentation';

const application: Provider[] = [
  GetTranscriptionUseCase,
  GetTranscriptionListUseCase,
  GetOneTranscriptionUseCase,
  UpdateTranscriptionUseCase,
  DeleteTranscriptionUseCase,
];
const infrastructure: Provider[] = [
  {
    provide: CategoryRepository,
    useClass: PrismaCategoryRepository,
  },
  {
    provide: TranscriptionRepository,
    useClass: PrismaTranscriptionRepository,
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
