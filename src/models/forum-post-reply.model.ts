import { Document, Schema, model } from 'mongoose';

import { ForumPostReply } from '@interfaces/forum.interface';

const forumPostReplySchema: Schema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'ForumPost',
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const forumPostReplyModel = model<ForumPostReply & Document>('ForumPostReply', forumPostReplySchema);

export default forumPostReplyModel;
