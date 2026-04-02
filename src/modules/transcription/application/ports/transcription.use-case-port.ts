import type { TranscriptionEntity } from '../../domain';
import type { JsonValue } from '../../../shared/types';

export declare namespace UseCasePort {
  namespace GetTranscription {
    export interface Input {
      transcriptionId: string;
      categoryId: string;
      language: 'ru';
      topic_tags: string[];
      audience_level: 'beginner' | 'middle';
      variants: number;
    }

    export interface Output {
      title: string | null;
      topic_tags: string[];
      transcription: JsonValue;
      audience_level: 'beginner' | 'middle';
      language: 'ru';
      variants: number;
      prompt: string | null;
    }
  }

  namespace GetTranscriptionList {
    export interface Output {
      content: Omit<TranscriptionEntity, 'content'>[];
    }
  }

  namespace GetOneTranscription {
    export interface Input {
      transcriptionId: string;
    }

    export type Output = TranscriptionEntity;
  }

  namespace UpdateTranscription {
    export interface Input {
      id: string;
      data: {
        fileName?: string;
        content?: JsonValue;
        section?: string;
        code?: string;
      };
    }

    export type Output = TranscriptionEntity;
  }

  namespace DeleteTranscription {
    export interface Input {
      id: string;
    }

    export type Output = void;
  }
}
