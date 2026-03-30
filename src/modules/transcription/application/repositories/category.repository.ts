import { CategoryEntity } from '../../domain';

export abstract class CategoryRepository {
  abstract findById(id: string): Promise<CategoryEntity>;
}
