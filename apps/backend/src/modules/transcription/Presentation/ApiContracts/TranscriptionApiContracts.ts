import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  }
}
