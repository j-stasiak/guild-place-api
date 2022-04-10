import { Document, Schema, model } from 'mongoose';

import { ForumPostPreview } from '@interfaces/forum.interface';

const forumPostPreviewSchema: Schema = new Schema(
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
    forumPost: {
      type: Schema.Types.ObjectId,
      ref: 'ForumPost',
    },
  },
  { timestamps: true },
);

const forumPostPreviewModel = model<ForumPostPreview & Document>('ForumPostPreview', forumPostPreviewSchema);

export default forumPostPreviewModel;
