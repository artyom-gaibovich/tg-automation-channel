import { Injectable, NotFoundException } from '@nestjs/common';
import { Transcription, TranscriptionRepository } from '../../../Application';
import { PrismaService } from '../../../../shared/persistence/prisma/prisma.service';

@Injectable()
export class PrismaTranscriptionRepository extends TranscriptionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Transcription> {
    const transcription = await this.prisma.transcribation.findUnique({
      where: { id },
    });
    if (!transcription) {
      throw new NotFoundException(`Transcription with id ${id} not found`);
    }
    return transcription;
  }

  findAll(): Promise<Omit<Transcription, 'content'>[]> {
    return this.prisma.transcribation.findMany({
      omit: {
        content: true,
      },
    });
  }

  async updatePartial(
    id: string,
    data: Partial<Omit<Transcription, 'id' | 'content'>>
  ): Promise<Transcription> {
    try {
      return await this.prisma.transcribation.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Transcription with id ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.transcribation.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Transcription with id ${id} not found`);
    }
  }
}
