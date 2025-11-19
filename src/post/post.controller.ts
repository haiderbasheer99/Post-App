import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ){}

    @Get('all-posts')
    @UseGuards(JwtAuthGuard)
    async getAllPosts(@CurrentUser('sub') userID: number){
        return this.postService.findAllPosts(userID);
    }

    @Get('single-post/:id')
    @UseGuards(JwtAuthGuard)
    async getOnePost(@Param('id', ParseIntPipe) id: number, 
                     @CurrentUser('sub') userID: number){
        return this.postService.findOnePost(id, userID);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() createPostDto: CreatePostDto, @CurrentUser('sub') userId: number){
        return this.postService.createPost(createPostDto, userId);
    }

    @Patch('update-post/:id')
    @Roles(UserRole.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updatePost(@Param('id', ParseIntPipe) id: number,
                     @CurrentUser('sub') userId: number,
                     @Body()updatePostDto: UpdatePostDto){
                return this.postService.updatePost(id, updatePostDto, userId);
    }

    @Delete('delete-post/:id')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deletePost(@Param('id', ParseIntPipe) id:number){
        return this.postService.deletePost(id);
    }

}
