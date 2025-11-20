import { Scenario } from '../../Domain';

export abstract class ScenarioRepository {
  abstract findById(id: string): Promise<Scenario>;
  abstract findAll(): Promise<Scenario[]>;
  abstract create(data: Omit<Scenario, 'id' | 'createdAt'>): Promise<Scenario>;
  abstract updatePartial(
    id: string,
    data: Partial<Omit<Scenario, 'id' | 'createdAt'>>
  ): Promise<Scenario>;
  abstract delete(id: string): Promise<void>;
}
