import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../repositories';
import { UseCasePort } from '../../presentation';

@Injectable()
export class UpdateScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(
    input: UseCasePort.UpdateScenario.Input,
  ): Promise<UseCasePort.UpdateScenario.Output> {
    return this.repo.updatePartial(input.id, input.data);
  }
}
