import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, CategoryRepository } from '../../../Application';
import { PrismaService } from '../../../../shared/persistence/prisma/prisma.service';

@Injectable()
export class PrismaCategoryRepository extends CategoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }
}
