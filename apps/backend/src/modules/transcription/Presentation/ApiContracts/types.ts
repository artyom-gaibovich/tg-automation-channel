import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transcription } from '../../Domain';

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
          @IsArray()
          @IsString({ each: true })
          @Matches(/^[a-zA-Z0-9_]+(,(asc|desc))?$/, {
            each: true,
            message: 'Sort format should be: property,(asc|desc)',
          })
          sort?: string[];
        }

        export class Body {
          // Пока пустое
        }
      }

      export namespace Response {
        export type Data = {
          content: Omit<Transcription, 'content'>[];
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
      }
      export namespace Response {
        export type Data = Transcription;
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
        }
      }

      export namespace Response {
        export type Data = Transcription;
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
  }
}
