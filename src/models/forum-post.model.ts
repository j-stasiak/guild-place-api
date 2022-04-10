import { Document, Schema, model } from 'mongoose';

import { ForumPost } from '@interfaces/forum.interface';

const forumPostSchema: Schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    replies: {
      type: [{ type: Schema.Types.ObjectId, ref: 'ForumPostReply' }],
    },
  },
  { timestamps: true },
);

const forumPostModel = model<ForumPost & Document>('ForumPost', forumPostSchema);

export default forumPostModel;
