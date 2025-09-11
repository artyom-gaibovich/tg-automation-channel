import { Injectable } from '@nestjs/common';
import { CreateAiAgentDto } from './dto/create-ai-agent.dto';
import { UpdateAiAgentDto } from './dto/update-ai-agent.dto';
import axios from 'axios';
import * as aiAgentInitConfig from './config/ai-agent.init.config';

@Injectable()
export class AiAgentService {
  constructor(private readonly config: aiAgentInitConfig.AIAgentConfig) {}

  async rewrite(msg: string) {
    return await axios.post(
      this.config.aiAgentAPI,
      {
        model: this.config.model,
        messages: [
          {
            role: 'user',
            content: msg,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.token}`,
        },
      }
    );
  }

  create(createAiAgentDto: CreateAiAgentDto) {
    return 'This action adds a new aiAgent';
  }

  findAll() {
    return `This action returns all aiAgent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiAgent`;
  }

  update(id: number, updateAiAgentDto: UpdateAiAgentDto) {
    return `This action updates a #${id} aiAgent`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiAgent`;
  }
}
