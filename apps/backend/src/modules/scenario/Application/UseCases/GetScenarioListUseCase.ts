import { Injectable } from '@nestjs/common';
import { ScenarioRepository } from '../Repositories';
import { IO } from '../../Presentation';

@Injectable()
export class GetScenarioListUseCase {
  constructor(private readonly repo: ScenarioRepository) {}

  async execute(): Promise<IO.GetScenarioList.Output> {
    return {
      content: await this.repo.findAll(),
    };
  }
}
