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
      transcription: string | null;
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
}
