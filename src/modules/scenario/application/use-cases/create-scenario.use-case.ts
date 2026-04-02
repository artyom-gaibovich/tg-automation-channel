import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../repositories';
import { UseCasePort } from '../../presentation';

@Injectable()
export class CreateScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(
    input: UseCasePort.CreateScenario.Input,
  ): Promise<UseCasePort.CreateScenario.Output> {
    return this.repo.create(input);
  }
}
