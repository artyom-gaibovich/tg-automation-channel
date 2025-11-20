import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../Repositories';
import { IO } from '../../Presentation';

@Injectable()
export class UpdateScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(
    input: IO.UpdateScenario.Input
  ): Promise<IO.UpdateScenario.Output> {
    return this.repo.updatePartial(input.id, input.data);
  }
}
