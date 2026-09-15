import { Injectable, NotFoundException } from '@nestjs/common';
import { TranscriptionEntity, TranscriptionRepository } from '../../../application';
import type { TranscriptionPageParams } from '../../../application/repositories';
import type { TranscriptionListItem } from '../../../domain';
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

  async findPage({
    skip,
    take,
    orderBy,
    codes,
  }: TranscriptionPageParams): Promise<{ items: TranscriptionListItem[]; total: number }> {
    const where = codes?.length ? { code: { in: codes } } : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.transcribation.findMany({
        where,
        select: {
          id: true,
          fileName: true,
          code: true,
          section: true,
          order: true,
          createdAt: true,
        },
        orderBy: { [orderBy.field]: orderBy.direction },
        skip,
        take,
      }),
      this.prisma.transcribation.count({ where }),
    ]);
    return { items, total };
  }

  async findDistinctCodes(): Promise<string[]> {
    const rows = await this.prisma.transcribation.findMany({
      select: { code: true },
      distinct: ['code'],
      where: { code: { not: null } },
      orderBy: { code: 'asc' },
    });
    return rows.map((row) => row.code).filter((code): code is string => code !== null);
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
