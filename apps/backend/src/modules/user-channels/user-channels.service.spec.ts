import { Test, TestingModule } from '@nestjs/testing';
import { UserChannelsService } from './user-channels.service';

describe('UserChannelsService', () => {
  let service: UserChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserChannelsService],
    }).compile();

    service = module.get<UserChannelsService>(UserChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
