import type { TranscriptionEntity, TranscriptionListItem } from '../../domain';
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
    export interface Input {
      page: number;
      size: number;
      sort?: string;
      codes?: string[];
    }

    export interface Output {
      content: TranscriptionListItem[];
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
      codes: string[];
    }
  }

  namespace GetOneTranscription {
    export interface Input {
      transcriptionId: string;
      textOnly?: boolean;
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

  namespace TranscribeYoutube {
    export interface Input {
      url: string;
      code: string;
      seoTags: string[];
    }

    export interface Output {
      id: string;
      filename: string;
      result: string;
    }
  }

  namespace DownloadYoutubeAudio {
    export interface Input {
      url: string;
    }

    export interface Output {
      /** Имя файла внутри папки uploads. */
      filename: string;
      /** Человекочитаемое имя файла (заголовок видео + .mp3). */
      originalName: string;
    }
  }
}
