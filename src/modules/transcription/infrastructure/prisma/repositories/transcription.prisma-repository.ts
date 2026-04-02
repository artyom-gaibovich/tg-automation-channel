import { Injectable, NotFoundException } from '@nestjs/common';
import { TranscriptionEntity, TranscriptionRepository } from '../../../application';
import { PrismaService } from '../../../../shared/persistence/prisma/prisma.service';

@Injectable()
export class TranscriptionPrismaRepository extends TranscriptionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<TranscriptionEntity> {
    const transcription = await this.prisma.transcribation.findUnique({
      where: { id },
    });
    if (!transcription) {
      throw new NotFoundException(`Transcription with id ${id} not found`);
    }
    return transcription;
  }

  findAll(): Promise<Omit<TranscriptionEntity, 'content'>[]> {
    return this.prisma.transcribation.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }

  async updatePartial(
    id: string,
    data: Partial<Omit<TranscriptionEntity, 'id' | 'content'>>,
  ): Promise<TranscriptionEntity> {
    try {
      return this.prisma.transcribation.update({
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
