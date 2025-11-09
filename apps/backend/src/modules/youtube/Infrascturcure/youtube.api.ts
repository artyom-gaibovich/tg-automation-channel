import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { YoutubeCommentThreadListResponse } from '../types/youtube.types';

class YoutubeVideoListResponse {
  items: any;
}

@Injectable()
export class YoutubeApi {
  private readonly apiKey = process.env.YOUTUBE_API_KEY;

  async getComments(videoId: string) {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads`;
    const res = await axios.get<YoutubeCommentThreadListResponse>(url, {
      params: {
        part: 'snippet',
        videoId,
        key: this.apiKey,
        maxResults: 20,
      },
    });

    return res.data.items.map((item) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));
  }

  async getVideoInfo(videoId: string) {
    const url = `https://www.googleapis.com/youtube/v3/videos`;

    const res = await axios.get<YoutubeVideoListResponse>(url, {
      params: {
        part: 'snippet',
        id: videoId,
        key: this.apiKey,
      },
    });

    if (!res.data.items.length) {
      throw new Error('Видео не найдено');
    }

    const snippet = res.data.items[0].snippet;

    return {
      title: res.data.items[0].snippet.title,
      tags: snippet.tags || [],
    };
  }
}
