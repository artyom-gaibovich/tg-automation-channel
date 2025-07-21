import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAiAgentDto } from './dto/create-ai-agent.dto';
import { UpdateAiAgentDto } from './dto/update-ai-agent.dto';
import axios from 'axios';
import * as aiAgentInitConfig from './config/ai-agent.init.config';

@Injectable()
export class AiAgentService {
  constructor(private readonly config: aiAgentInitConfig.AIAgentConfig) {}

  async rewrite() {
    try {
      const response = await axios.post(
        this.config.aiAgentAPI + 'OK',
        {
          model: this.config.model,
          messages: [
            {
              role: 'user',
              content: 'Привет :)!',
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
      console.log(response);
    } catch (error) {
      console.error('AXIOS');
      throw error;
    }
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
