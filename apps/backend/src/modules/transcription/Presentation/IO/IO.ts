import { JsonValue } from '@prisma/client/runtime/library';
import { Transcription } from '../../Domain';

export declare namespace IO {
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
      content: Omit<Transcription, 'content'>[];
    }
  }

  namespace GetOneTranscription {
    export interface Input {
      transcriptionId: string;
    }

    export type Output = Transcription;
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

    export type Output = Transcription;
  }

  namespace DeleteTranscription {
    export interface Input {
      id: string;
    }

    export type Output = void;
  }
}
