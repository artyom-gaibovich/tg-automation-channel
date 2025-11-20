import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../Repositories';
import { IO } from '../../Presentation';

@Injectable()
export class DeleteScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(input: IO.DeleteScenario.Input): Promise<void> {
    await this.repo.delete(input.id);
  }
}
