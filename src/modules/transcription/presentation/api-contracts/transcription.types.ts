import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TranscriptionEntity, TranscriptionListItem } from '../../domain';

export namespace TranscriptionApiContracts {
  export namespace Api {
    export namespace GetTranscription {
      export namespace Request {
        export class Body {
          @IsString()
          @IsNotEmpty()
          transcriptionId: string;

          @IsString()
          @IsNotEmpty()
          categoryId: string;

          @IsIn(['ru'])
          language: 'ru';

          @IsArray()
          @ArrayMinSize(1)
          @IsString({ each: true })
          topic_tags: string[];

          @IsIn(['beginner', 'middle'])
          audience_level: 'beginner' | 'middle';

          @IsNumber()
          @Type(() => Number)
          variants: number;
        }
      }

      export namespace Response {
        export type Data = {
          message: string;
        };
      }
    }

    export namespace Filter {
      export namespace Request {
        export class Query {
          @IsOptional()
          @IsInt()
          @Min(0)
          @Type(() => Number)
          page?: number = 0;

          @IsOptional()
          @IsInt()
          @Min(1)
          @Type(() => Number)
          size?: number = 20;

          @IsOptional()
          @IsString()
          @Matches(/^[a-zA-Z0-9_]+,(asc|desc)$/, {
            message: 'Sort format should be: property,(asc|desc)',
          })
          sort?: string;
        }

        export class Body {
          @IsOptional()
          @IsArray()
          @IsString({ each: true })
          codes?: string[];
        }
      }

      export namespace Response {
        export type Data = {
          content: TranscriptionListItem[];
          page: number;
          size: number;
          totalElements: number;
          totalPages: number;
          codes: string[];
        };
      }
    }

    export namespace GetOneTranscription {
      export namespace Request {
        export class Params {
          @IsString()
          @IsNotEmpty()
          id: string;
        }

        export class Query {
          // Если true — из content убираются offsets/timestamps, а транскрипция
          // отдаётся единой строкой текста. По умолчанию false для обратной совместимости.
          @IsOptional()
          @Transform(({ value }) => value === 'true' || value === true)
          @IsBoolean()
          textOnly?: boolean = false;
        }
      }
      export namespace Response {
        export type Data = TranscriptionEntity;
      }
    }

    export namespace PatchTranscription {
      export namespace Request {
        export class Params {
          @IsString()
          @IsNotEmpty()
          id: string;
        }

        export class Body {
          @IsOptional()
          @IsString()
          fileName?: string;

          @IsOptional()
          @IsString()
          code?: string;

          @IsOptional()
          @IsString()
          section?: string;

          @IsOptional()
          @IsNumber()
          order?: number;
        }
      }

      export namespace Response {
        export type Data = TranscriptionEntity;
      }
    }

    export namespace DeleteTranscription {
      export namespace Request {
        export class Params {
          @IsString()
          @IsNotEmpty()
          id: string;
        }
      }

      export namespace Response {
        export type Data = {
          success: true;
        };
      }
    }

    export namespace TranscribeYoutube {
      export namespace Request {
        export class Body {
          @IsString()
          @IsNotEmpty()
          @IsUrl({ require_protocol: true })
          url: string;

          @IsString()
          @IsNotEmpty()
          code: string;

          @IsOptional()
          @IsArray()
          @IsString({ each: true })
          seo_tags?: string[];
        }
      }

      export namespace Response {
        // Загрузка идёт в фоне — сразу возвращаем идентификатор задачи.
        export type Data = {
          jobId: string;
        };
      }
    }

    export namespace DownloadYoutubeAudio {
      export namespace Request {
        export class Body {
          @IsString()
          @IsNotEmpty()
          @IsUrl({ require_protocol: true })
          url: string;
        }
      }
    }

    export namespace YoutubeJobStatus {
      export namespace Request {
        export class Params {
          @IsString()
          @IsNotEmpty()
          jobId: string;
        }
      }

      export namespace Response {
        export type Data = {
          status: 'pending' | 'done' | 'error';
          error?: string;
          transcriptionId?: string;
        };
      }
    }
  }
}
