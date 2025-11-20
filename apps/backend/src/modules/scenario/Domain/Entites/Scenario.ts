export class Scenario {
  constructor(
    public readonly id: string,
    public readonly content: string | null,
    public readonly code: string | null,
    public readonly section: string | null,
    public readonly createdAt: Date,
    public readonly order: number | null,
    public readonly tags: string[]
  ) {}

  static create(params: {
    id: string;
    content?: string;
    code?: string;
    section?: string;
    createdAt: Date;
    order?: number | undefined;
    tags?: string[];
  }): Scenario {
    return new Scenario(
      params.id,
      params.content ?? null,
      params.code ?? null,
      params.section ?? null,
      params.createdAt,
      params.order ?? 0,
      params.tags ?? []
    );
  }
}
