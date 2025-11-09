export class Category {
  constructor(
    public readonly id: string,
    public readonly prompt: string,
    public readonly name: string
  ) {}

  static create(params: {
    id: string;
    prompt: string;
    name: string;
    code: string;
  }): Category {
    return new Category(params.id, params.prompt, params.name);
  }
}
