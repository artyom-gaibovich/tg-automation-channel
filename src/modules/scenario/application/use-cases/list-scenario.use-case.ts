import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../repositories';
import { UseCasePort } from '../../presentation';

@Injectable()
export class ListScenarioUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(): Promise<UseCasePort.GetScenarioList.Output> {
    return {
      content: await this.repo.findAll(),
    };
  }
}
