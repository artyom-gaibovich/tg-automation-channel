import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type YoutubeJobStatus = 'pending' | 'done' | 'error';

export interface YoutubeJob {
  id: string;
  status: YoutubeJobStatus;
  url: string;
  error?: string;
  transcriptionId?: string;
  createdAt: number;
}

// Сколько держать завершённые задачи в памяти, прежде чем удалить.
const JOB_TTL_MS = 60 * 60 * 1000; // 1 час

/**
 * Простое in-memory хранилище фоновых задач загрузки с YouTube.
 * Загрузка + транскрибация выполняются асинхронно, а фронт опрашивает статус
 * по jobId. Для одного инстанса бэкенда этого достаточно; при масштабировании
 * стоит вынести в Redis/БД.
 */
@Injectable()
export class YoutubeJobStore {
  private readonly jobs = new Map<string, YoutubeJob>();

  create(url: string): YoutubeJob {
    this.prune();
    const job: YoutubeJob = {
      id: randomUUID(),
      status: 'pending',
      url,
      createdAt: Date.now(),
    };
    this.jobs.set(job.id, job);
    return job;
  }

  get(id: string): YoutubeJob | undefined {
    return this.jobs.get(id);
  }

  setDone(id: string, transcriptionId: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.status = 'done';
      job.transcriptionId = transcriptionId;
    }
  }

  setError(id: string, error: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.status = 'error';
      job.error = error;
    }
  }

  private prune(): void {
    const now = Date.now();
    for (const [id, job] of this.jobs) {
      if (now - job.createdAt > JOB_TTL_MS) {
        this.jobs.delete(id);
      }
    }
  }
}
