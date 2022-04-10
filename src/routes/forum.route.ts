import { CreateForumPostDto } from '@/dtos/forum.dto';
import ForumPostsController from '@/controllers/forum.controller';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class ForumRoute implements Routes {
  public path = '/forum';
  public router = Router();
  public forumController = new ForumPostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.forumController.getForumPosts);
    this.router.post(`${this.path}/:id/add-reply`, authMiddleware, this.forumController.createForumPostReply);
    this.router.get(`${this.path}/:id`, this.forumController.getForumPostById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateForumPostDto, 'body'), this.forumController.createForumPost);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateForumPostDto, 'body', true), this.forumController.updateForumPost);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.forumController.deleteForumPost);
  }
}

export default ForumRoute;
