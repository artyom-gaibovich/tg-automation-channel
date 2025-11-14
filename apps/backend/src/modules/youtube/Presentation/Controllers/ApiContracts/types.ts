import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export namespace YouTubeApiContracts {
  export type TranslateResult = {
    filename: string;
    result: string;
  };

  export namespace Api {
    export namespace UploadMultiple {
      export namespace Request {
        export class Body {
          @IsString()
          @IsNotEmpty()
          code: string;

          @IsArray()
          @IsString({ each: true })
          @Type(() => String)
          seo_tags: string[];
        }

        export type Files = Express.Multer.File[];
      }

      export namespace Response {
        export type TranslatedItem = {
          file: string;
          result: TranslateResult[];
        };

        export type Data = {
          message: string;
          results: TranslatedItem[];
        };
      }
    }
  }
}
