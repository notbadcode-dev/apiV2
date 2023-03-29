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
        return await this.userService.createUser(userCreate);
    }

    @Put('/:id')
    async updateUser(@Param('id') userId: number, @Body() userUpdate: IUserUpdater): Promise<IUserUpdater> {
        return await this.userService.updateUser(userId, userUpdate);
    }

    @Get('/:id')
    async getUser(@Param('id') userId: number): Promise<IUser> {
        return await this.userService.getUser(userId);
    }

    @Get('/')
    async getAllUsers(): Promise<IUser[]> {
        return await this.userService.getAllUsers();
    }
}
