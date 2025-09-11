export interface YoutubeCommentThreadListResponse {
  items: YoutubeCommentThread[];
}

export interface YoutubeCommentThread {
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        textDisplay: string;
        publishedAt: string;
      };
    };
  };
}


export interface YoutubeVideo {
  snippet: {
    title: string;
  };
}
