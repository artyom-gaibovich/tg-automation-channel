import { Module, Provider } from '@nestjs/common';
import {
  CreateScenarioUseCase,
  DeleteScenarioUseCase,
  GetScenarioUseCase,
  ListScenarioUseCase,
  ScenarioRepository,
  UpdateScenarioUseCase,
} from './application';

import { ScenarioController } from './presentation';
import { ScenarioPrismaRepository } from './infrastructure';

const application: Provider[] = [
  CreateScenarioUseCase,
  GetScenarioUseCase,
  ListScenarioUseCase,
  UpdateScenarioUseCase,
  DeleteScenarioUseCase,
];

const infrastructure: Provider[] = [
  { provide: ScenarioRepository, useClass: ScenarioPrismaRepository },
];

@Module({
  providers: [...application, ...infrastructure],
  controllers: [ScenarioController],
})
export class ScenarioModule {}
