import { ScenarioEntity } from '../../domain';

export abstract class ScenarioRepository {
  abstract findById(id: string): Promise<ScenarioEntity>;
  abstract findAll(): Promise<ScenarioEntity[]>;
  abstract create(data: Omit<ScenarioEntity, 'id' | 'createdAt'>): Promise<ScenarioEntity>;
  abstract updatePartial(
    id: string,
    data: Partial<Omit<ScenarioEntity, 'id' | 'createdAt'>>,
  ): Promise<ScenarioEntity>;
  abstract delete(id: string): Promise<void>;
}
