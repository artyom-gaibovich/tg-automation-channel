import { Category } from '../Domain';

export abstract class CategoryRepository {
  abstract findById(id: string): Promise<Category>;
}
