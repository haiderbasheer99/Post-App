import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from 'src/user/user.service';


@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly userService: UserService
    ) { }

    public async findAllPosts(userID: number) {
        try {

            let allPost = await this.postRepository.find({
                where: { user: { id: userID } },
                relations: ['user']
            });

            //to check if the user has No Posts 
            if(allPost.length === 0){
                throw new NotFoundException('Sorry..! You Dont Have Posts Yet')
            }
            return allPost.map((post) => {
                if (post && post.user) {
                    const { user, ...rest } = post;
                    const { password, ...safeUser } = user;
                    return {
                        ...rest,
                        user: safeUser
                    }
                }
                return post;
            })
        } catch (error) {
            throw new NotFoundException(error.response)
        }
    }

    public async findOnePost(id: number, userId: number) {
        try {
            const ownerOfPost = await this.postRepository.findOne({
                where: {
                    user: {id: userId}
                }
            })
            if(!ownerOfPost){
                throw new UnauthorizedException('You Dont Own This Post')
            }
            const post = await this.postRepository.findOne({
                where: { id },
                relations: ['user']
            });

            if (!post) {
                throw new NotFoundException(`Post With Id ${id} Not Found`);
            }
            const { password, ...rest } = post.user
            return {
                ...post,
                user: rest
            }
        } catch (error) {
            throw new NotFoundException(error.response)
        }

    }

    public async createPost(createPostDto: CreatePostDto, userId: number) {
        try {
            const user = await this.userService.findUserById(userId)
            if (!user) {
                throw new NotFoundException('You Cant Create Post bcs You Are no Auth User')
            }
            const { password, ...safeUser } = user;
            const post = this.postRepository.create({
                user: safeUser,
                ...createPostDto
            });
            return await this.postRepository.save(post);

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error)
            }
            throw new BadRequestException(error.response)
        }

    }

    public async updatePost(id: number, updatePostDto: UpdatePostDto, userId: number) {
        try {
            let post = await this.findOnePost(id, userId);
            if (!post) {
                throw new NotFoundException(`Post With Id ${id} Not Found`);
            }
            const user = await this.userService.findUserById(userId);
            if (!user) {
                throw new ForbiddenException('You Are Not Allowed To Update This Post')
            }
            if (user.id !== post.user.id) {
                throw new ForbiddenException('You Are Not Allowed To Update This Post');
            }

            post.title = updatePostDto.title ?? post.title;
            post.content = updatePostDto.content ?? post.content;

            return await this.postRepository.save(post);

        } catch (error) {
            if (error.status === 404) {
                throw new NotFoundException(error.response)
            }
            if (error.status === 403) {
                throw new ForbiddenException(error.response)
            }
            throw new BadRequestException(error)
        }

    }
    public async deletePost(id: number) {
        try {
            const post = await this.postRepository.findOneBy({ id });
            if (!post) {
                throw new NotFoundException(`Post With Id ${id} Not Found`);
            }
            return await this.postRepository.delete(post);
        } catch (error) {
            throw new BadRequestException(error.response);
        }

    }
}
