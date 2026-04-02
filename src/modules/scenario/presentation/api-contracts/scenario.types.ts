import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ScenarioEntity } from '../../domain';
import { StatusEnum } from '../../domain/entities/scenario.entity';

export namespace ScenarioApiContracts {
  export namespace Api {
    export namespace CreateScenario {
      export namespace Request {
        export class Body {
          @IsOptional() @IsString() content: string;
          @IsOptional() @IsString() code: string;
          @IsOptional() @IsString() section: string;
          @IsOptional() @IsEnum(StatusEnum) status: string;
          @IsOptional() @IsInt() order: number;
          @IsOptional() @IsArray() @IsString({ each: true }) tags: string[];
        }
      }
      export namespace Response {
        export type Data = ScenarioEntity;
      }
    }

    export namespace GetOneScenario {
      export namespace Request {
        export class Params {
          @IsString()
          id: string;
        }
      }
      export namespace Response {
        export type Data = ScenarioEntity;
      }
    }

    export namespace GetScenarioList {
      export namespace Response {
        export type Data = { content: ScenarioEntity[] };
      }
    }

    export namespace UpdateScenario {
      export namespace Request {
        export class Params {
          @IsString()
          id: string;
        }

        export class Body {
          @IsOptional() @IsString() content?: string;
          @IsOptional() @IsString() code?: string;
          @IsOptional() @IsString() section?: string;
          @IsOptional() @IsEnum(StatusEnum) status: StatusEnum;
          @IsOptional() @IsInt() order?: number;
          @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
        }
      }
      export namespace Response {
        export type Data = ScenarioEntity;
      }
    }

    export namespace DeleteScenario {
      export namespace Request {
        export class Params {
          @IsString()
          id: string;
        }
      }
      export namespace Response {
        export type Data = { success: true };
      }
    }
  }
}
