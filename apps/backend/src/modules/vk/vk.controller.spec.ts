import { Test, TestingModule } from '@nestjs/testing';
import { VkController } from './vk.controller';
import { VkService } from './vk.service';

describe('VkController', () => {
  let controller: VkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VkController],
      providers: [VkService],
    }).compile();

    controller = module.get<VkController>(VkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
