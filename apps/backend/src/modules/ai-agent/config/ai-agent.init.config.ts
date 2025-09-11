import { ConfigService } from '@nestjs/config';

export interface  AIAgentConfig {
  token: string;
  model: string;
  aiAgentAPI: string;
}

export const aiAgentInitConfig = (
  configService: ConfigService
): AIAgentConfig => {
  const token = configService.get<string>('AI_AGENT_TOKEN');
  if (!token) {
    throw new Error('No AI_AGENT_TOKEN');
  }

  const model = configService.get<string>('MODEL');
  if (!model) {
    throw new Error('No AI_AGENT_TOKEN');
  }

  const aiAgentAPI = configService.get<string>('AI_AGENT_API');
  if (!aiAgentAPI) {
    throw new Error('No AI_AGENT_TOKEN');
  }

  return {
    token,
    model,
    aiAgentAPI
  };
};
