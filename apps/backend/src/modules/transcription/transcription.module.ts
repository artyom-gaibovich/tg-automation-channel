import { Module, Provider } from '@nestjs/common';

import {
  CategoryRepository,
  GetTranscriptionUseCase,
  TranscriptionRepository,
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
import { GetTranscriptionListUseCase } from './Application/UseCases/GetTranscriptionListUseCase';

const application: Provider[] = [
  GetTranscriptionUseCase,
  GetTranscriptionListUseCase,
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
