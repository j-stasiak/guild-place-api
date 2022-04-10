import { IsOptional, IsString } from 'class-validator';

export class CreateForumPostDto {
  @IsString()
  @IsOptional()
  public author: string;

  @IsString()
  public title: string;

  @IsString()
  public message: string;
}

export class CreateForumPostReplyDto {
  @IsString()
  public message: string;
}
