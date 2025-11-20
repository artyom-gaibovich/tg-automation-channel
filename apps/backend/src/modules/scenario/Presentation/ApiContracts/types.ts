import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Scenario } from '../../Domain';

export namespace ScenarioApiContracts {
  export namespace Api {
    export namespace CreateScenario {
      export namespace Request {
        export class Body {
          @IsOptional() @IsString() content: string;
          @IsOptional() @IsString() code: string;
          @IsOptional() @IsString() section: string;
          @IsOptional() @IsInt() order: number;
          @IsOptional() @IsArray() @IsString({ each: true }) tags: string[];
        }
      }
      export namespace Response {
        export type Data = Scenario;
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
        export type Data = Scenario;
      }
    }

    export namespace GetScenarioList {
      export namespace Response {
        export type Data = { content: Scenario[] };
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
          @IsOptional() @IsInt() order?: number;
          @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
        }
      }
      export namespace Response {
        export type Data = Scenario;
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
