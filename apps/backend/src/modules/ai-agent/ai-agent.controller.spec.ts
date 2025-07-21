import { Test, TestingModule } from '@nestjs/testing';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';

describe('AiAgentController', () => {
  let controller: AiAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiAgentController],
      providers: [AiAgentService],
    }).compile();

    controller = module.get<AiAgentController>(AiAgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
