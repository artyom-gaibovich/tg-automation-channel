import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../Repositories';
import { IO } from '../../Presentation';

@Injectable()
export class GetOneScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(
    input: IO.GetOneScenario.Input
  ): Promise<IO.GetOneScenario.Output> {
    return this.repo.findById(input.id);
  }
}
