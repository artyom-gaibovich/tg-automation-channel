export const Status = {
  ON_DRAFT: 'ON_DRAFT',
  ON_WROK: 'ON_WROK',
  ON_PUBLISHED: 'ON_PUBLISHED',
  ON_VIDEO_EDITING: 'ON_VIDEO_EDITING',
  ON_VIDEO_SCRIPT: 'ON_VIDEO_SCRIPT',
};

export enum StatusEnum {
  ON_DRAFT = 'ON_DRAFT',
  ON_WROK = 'ON_WROK',
  ON_PUBLISHED = 'ON_PUBLISHED',
  ON_VIDEO_EDITING = 'ON_VIDEO_EDITING',
  ON_VIDEO_SCRIPT = 'ON_VIDEO_SCRIPT',
}

export type Status = (typeof Status)[keyof typeof Status];

export class ScenarioEntity {
  constructor(
    public readonly id: string,
    public readonly content: string | null,
    public readonly code: string | null,
    public readonly section: string | null,
    public readonly status: Status,
    public readonly createdAt: Date,
    public readonly order: number | null,
    public readonly tags: string[],
  ) {}

  static create(params: {
    id: string;
    content?: string;
    code?: string;
    section?: string;
    createdAt: Date;
    order?: number | undefined;
    status: Status;
    tags?: string[];
  }): ScenarioEntity {
    return new ScenarioEntity(
      params.id,
      params.content ?? null,
      params.code ?? null,
      params.section ?? null,
      params.status ?? Status.ON_DRAFT,
      params.createdAt,
      params.order ?? 0,
      params.tags ?? [],
    );
  }
}
