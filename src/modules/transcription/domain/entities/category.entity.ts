export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly prompt: string,
    public readonly name: string,
  ) {}

  static create(params: {
    id: string;
    prompt: string;
    name: string;
    code: string;
  }): CategoryEntity {
    return new CategoryEntity(params.id, params.prompt, params.name);
  }
}
