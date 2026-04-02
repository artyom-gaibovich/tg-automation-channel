import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../repositories';
import { UseCasePort } from '../../presentation';

@Injectable()
export class DeleteScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(input: UseCasePort.DeleteScenario.Input): Promise<void> {
    await this.repo.delete(input.id);
  }
}
