import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { AiAgentController } from './ai-agent.controller';
import {
  aiAgentInitConfig,
} from './config/ai-agent.init.config';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AiAgentController],
  providers: [
    {
      provide: AiAgentService,
      useFactory: (configService: ConfigService) => {
        return new AiAgentService(aiAgentInitConfig(configService));
      },
      inject: [ConfigService],
    },
  ],
  imports: [],
  exports: [AiAgentService],
})
export class AiAgentModule {}
