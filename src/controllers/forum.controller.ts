import { CreateForumPostDto, CreateForumPostReplyDto } from '@dtos/forum.dto';
import { ForumPost, ForumPostPreview } from '@interfaces/forum.interface';
import { NextFunction, Request, Response } from 'express';

import { RequestWithUser } from '@/interfaces/auth.interface';
import forumService from '@services/forum.service';

class ForumPostsController {
  public forumService = new forumService();

  public getForumPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllForumPostsData: ForumPostPreview[] = await this.forumService.findAllForumPosts();

      res.status(200).json({ data: findAllForumPostsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getForumPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const findOneForumPostData: ForumPost = await this.forumService.findForumPostById(postId);

      res.status(200).json({ data: findOneForumPostData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createForumPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const forumPostData: CreateForumPostDto = req.body;
      const createForumPostData: ForumPost = await this.forumService.createForumPost({ ...forumPostData, author: req.user._id.toString() });

      res.status(201).json({ data: createForumPostData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public createForumPostReply = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const userId: string = req.user._id;
      const forumPostData: CreateForumPostReplyDto = req.body;
      const createForumPostData: ForumPost = await this.forumService.addReplyToPost(postId, userId, forumPostData);

      res.status(201).json({ data: createForumPostData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateForumPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const forumPostData: CreateForumPostDto = req.body;
      const updateForumPostData: ForumPost = await this.forumService.updateForumPost(postId, { ...forumPostData, author: req.user._id.toString() });

      res.status(200).json({ data: updateForumPostData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteForumPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const deleteForumPostData: ForumPost = await this.forumService.deleteForumPost(postId);

      res.status(200).json({ data: deleteForumPostData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ForumPostsController;
