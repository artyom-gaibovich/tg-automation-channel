import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../Repositories';
import { IO } from '../../Presentation';

@Injectable()
export class CreateScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(
    input: IO.CreateScenario.Input
  ): Promise<IO.CreateScenario.Output> {
    return this.repo.create(input);
  }
}
