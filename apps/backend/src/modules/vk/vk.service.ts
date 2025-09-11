import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VkService {
  private readonly logger = new Logger(VkService.name);

  private readonly vkApiUrl = 'https://api.vk.com/method';
  private readonly accessToken = process.env.VK_ACCESS_TOKEN ?? '';
  private readonly apiVersion = '5.199';

  async postToWall({ ownerId, message }: { ownerId: number; message: string }) {
    try {
      const params = new URLSearchParams({
        owner_id: ownerId.toString(),
        message,
        access_token: this.accessToken,
        v: this.apiVersion,
      });

      const { data } = await axios.post(`${this.vkApiUrl}/wall.post`, params);

      if (data.error) {
        this.logger.error(`VK API Error: ${JSON.stringify(data.error)}`);
        throw new Error(data.error.error_msg);
      }

      return data.response;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to post to VK wall: ${error.message}`);
      }
      throw error;
    }
  }
}
