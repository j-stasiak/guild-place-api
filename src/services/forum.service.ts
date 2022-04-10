import { CreateForumPostDto, CreateForumPostReplyDto } from '@dtos/forum.dto';
import { ForumPost, ForumPostPreview, ForumPostReply } from '@interfaces/forum.interface';

import { HttpException } from '@exceptions/HttpException';
import forumPostModel from '@/models/forum-post.model';
import forumPostPreviewModel from '@/models/forum-post-preview.model';
import forumPostReplyModel from '@/models/forum-post-reply.model';

class ForumPostService {
  public forumPosts = forumPostModel;
  public forumPostPreviews = forumPostPreviewModel;
  public forumPostReplies = forumPostReplyModel;

  public async findAllForumPosts(): Promise<ForumPostPreview[]> {
    const posts: ForumPostPreview[] = await this.forumPostPreviews.find().populate('author');
    return posts;
  }

  public async findForumPostById(postId: string): Promise<ForumPost> {
    const findForumPost: ForumPost = await this.forumPosts
      .findOne({ _id: postId })
      .populate('author')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          model: 'User',
        },
      });
    if (!findForumPost) throw new HttpException(404, 'Forum post not found');

    return findForumPost;
  }

  public async createForumPost(forumPostData: CreateForumPostDto): Promise<ForumPost> {
    const createForumPostData: ForumPost = await this.forumPosts.create(forumPostData);
    await this.forumPostPreviews.create({ ...forumPostData, forumPost: createForumPostData._id });
    return createForumPostData;
  }

  public async addReplyToPost(postId: string, userId: string, forumPostReplyData: CreateForumPostReplyDto): Promise<ForumPost> {
    const createForumPostReplyData: ForumPostReply = await this.forumPostReplies.create({ ...forumPostReplyData, post: postId, author: userId });

    const forumPost: ForumPost = await this.forumPosts.findById(postId).populate('replies').populate('author');
    if (!forumPost) throw new HttpException(404, 'Forum post not found');
    const updatedForumPost = await this.forumPosts.findByIdAndUpdate(postId, { replies: [...forumPost.replies, createForumPostReplyData] });

    return updatedForumPost;
  }

  public async updateForumPost(postId: string, forumPostData: CreateForumPostDto): Promise<ForumPost> {
    const updateForumPostById: ForumPost = await this.forumPosts
      .findByIdAndUpdate(postId, { ...forumPostData, edited: true })
      .populate('author')
      .populate('replies');
    if (!updateForumPostById) throw new HttpException(404, 'Forum post not found');

    return updateForumPostById;
  }

  public async deleteForumPost(postId: string): Promise<ForumPost> {
    const deleteForumPostById: ForumPost = await this.forumPosts.findByIdAndDelete(postId);
    await this.forumPostPreviews.findOneAndDelete({ forumPost: postId });
    if (!deleteForumPostById) throw new HttpException(404, 'Forum post not found');

    return deleteForumPostById;
  }
}

export default ForumPostService;
