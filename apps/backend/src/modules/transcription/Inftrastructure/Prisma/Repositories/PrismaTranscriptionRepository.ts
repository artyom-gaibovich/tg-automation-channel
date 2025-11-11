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
}
