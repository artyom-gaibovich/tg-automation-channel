import { Scenario } from '../../Domain';

export declare namespace IO {
  namespace CreateScenario {
    export interface Input {
      content: string;
      code: string;
      section: string;
      order: number;
      tags: string[];
    }
    export type Output = Scenario;
  }

  namespace GetOneScenario {
    export interface Input {
      id: string;
    }
    export type Output = Scenario;
  }

  namespace GetScenarioList {
    export interface Output {
      content: Scenario[];
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
    export type Output = Scenario;
  }

  namespace DeleteScenario {
    export interface Input {
      id: string;
    }
    export type Output = void;
  }
}
