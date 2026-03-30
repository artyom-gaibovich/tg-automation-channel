import { ScenarioEntity } from '../../domain';
import { Status } from '../../domain/entities/scenario.entity';

export declare namespace UseCasePort {
  namespace CreateScenario {
    export interface Input {
      content: string;
      code: string;
      section: string;
      status: Status;
      order: number;
      tags: string[];
    }
    export type Output = ScenarioEntity;
  }

  namespace GetOneScenario {
    export interface Input {
      id: string;
    }
    export type Output = ScenarioEntity;
  }

  namespace GetScenarioList {
    export interface Output {
      content: ScenarioEntity[];
    }
  }

  namespace UpdateScenario {
    export interface Input {
      id: string;
      data: {
        content?: string;
        code?: string;
        section?: string;
        order?: number;
        tags?: string[];
      };
    }
    export type Output = ScenarioEntity;
  }

  namespace DeleteScenario {
    export interface Input {
      id: string;
    }
    export type Output = void;
  }
}
