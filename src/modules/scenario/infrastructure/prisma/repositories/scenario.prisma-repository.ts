import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/persistence/prisma/prisma.service';
import { ScenarioRepository } from '../../../application';
import { ScenarioEntity } from '../../../domain';

@Injectable()
export class ScenarioPrismaRepository extends ScenarioRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<ScenarioEntity> {
    const scenario = await this.prisma.scenario.findUnique({ where: { id } });
    if (!scenario) throw new NotFoundException(`Scenario ${id} not found`);
    return scenario;
  }

  async findAll(): Promise<ScenarioEntity[]> {
    return this.prisma.scenario.findMany();
  }

  async create(data: Omit<ScenarioEntity, 'id' | 'createdAt' | 'status'>): Promise<ScenarioEntity> {
    return this.prisma.scenario.create({ data });
  }

  async updatePartial(
    id: string,
    data: Partial<Omit<ScenarioEntity, 'id' | 'createdAt' | 'status'>>,
  ): Promise<ScenarioEntity> {
    try {
      return await this.prisma.scenario.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Scenario ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.scenario.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Scenario ${id} not found`);
    }
  }
}
