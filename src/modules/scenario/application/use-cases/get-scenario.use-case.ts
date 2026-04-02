import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../repositories';
import { UseCasePort } from '../../presentation';

@Injectable()
export class GetScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(
    input: UseCasePort.GetOneScenario.Input,
  ): Promise<UseCasePort.GetOneScenario.Output> {
    return this.repo.findById(input.id);
  }
}
