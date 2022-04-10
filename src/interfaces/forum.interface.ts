export interface ForumPostPreview {
  _id: string;
  author: string;
  createdAt: string;
  title: string;
  updatedAt: string;
}

export interface ForumPost {
  _id: string;
  author: string;
  title: string;
  message: string;
  replies: ForumPostReply[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostReply {
  _id: string;
  author: string;
  post: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
