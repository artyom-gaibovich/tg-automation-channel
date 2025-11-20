import { Module, Provider } from '@nestjs/common';
import {
  CreateScenarioUseCase,
  DeleteScenarioUseCase,
  GetOneScenarioUseCase,
  GetScenarioListUseCase,
  ScenarioRepository,
  UpdateScenarioUseCase,
} from './Application';

import { ScenarioController } from './Presentation';
import { PrismaScenarioRepository } from './Infrastructure';

const application: Provider[] = [
  CreateScenarioUseCase,
  GetOneScenarioUseCase,
  GetScenarioListUseCase,
  UpdateScenarioUseCase,
  DeleteScenarioUseCase,
];

const infrastructure: Provider[] = [
  { provide: ScenarioRepository, useClass: PrismaScenarioRepository },
];

@Module({
  providers: [...application, ...infrastructure],
  controllers: [ScenarioController],
})
export class ScenarioModule {}
