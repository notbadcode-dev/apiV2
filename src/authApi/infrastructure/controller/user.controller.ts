import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';
import { Body, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { UserService } from '@service/user.service';

@Service()
@JsonController('/user')
export class UserController {
    constructor(@Inject() private userService: UserService) {}

    @Post('/')
    async createUser(@Body() userCreate: IUserCreate): Promise<IUserCreated> {
        const CREATED_USER: IUserCreated = await this.userService.createUser(userCreate);
        return CREATED_USER;
    }

    @Put('/:id')
    async updateUser(@Param('id') userId: number, @Body() userUpdate: IUserUpdater): Promise<IUserUpdater> {
        const UPDATED_USER: IUserUpdater = await this.userService.updateUser(userId, userUpdate);
        return UPDATED_USER;
    }

    @Get('/:id')
    async getUser(@Param('id') userId: number): Promise<IUser> {
        const USER: IUser = await this.userService.getUser(userId);
        return USER;
    }

    @Get('/')
    async getAllUsers(): Promise<IUser[]> {
        const USER_LIST: IUser[] = await this.userService.getAllUserList();
        return USER_LIST;
    }
}
