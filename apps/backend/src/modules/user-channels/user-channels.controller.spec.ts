import { Test, TestingModule } from '@nestjs/testing';
import { UserChannelsController } from './user-channels.controller';
import { UserChannelsService } from './user-channels.service';

describe('UserChannelsController', () => {
  let controller: UserChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserChannelsController],
      providers: [UserChannelsService],
    }).compile();

    controller = module.get<UserChannelsController>(UserChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
