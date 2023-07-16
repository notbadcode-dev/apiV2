import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';
import { IUserService } from '@service/interface/user.service.interface';
import { USER_SERVICE_TOKEN } from '@service/user.service';
import { Body, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
@JsonController('/user')
export class UserController {
    constructor(@Inject(USER_SERVICE_TOKEN) private _userService: IUserService) {}

    @Post('/')
    async createUser(@Body() userCreate: IUserCreate): Promise<IUserCreated> {
        const CREATED_USER: IUserCreated = await this._userService.createUser(userCreate);
        return CREATED_USER;
    }

    @Put('/:id')
    async updateUser(@Param('id') userId: number, @Body() userUpdate: IUserUpdater): Promise<IUserUpdater> {
        const UPDATED_USER: IUserUpdater = await this._userService.updateUser(userId, userUpdate);
        return UPDATED_USER;
    }

    @Get('/:id')
    async getUser(@Param('id') userId: number): Promise<IUser> {
        const USER: IUser = await this._userService.getUser(userId);
        return USER;
    }

    @Get('/')
    async getAllUsers(): Promise<IUser[]> {
        const USER_LIST: IUser[] = await this._userService.getAllUserList();
        return USER_LIST;
    }
}
