import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { TUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';
import { Authority } from '@service/decorator/authority.decorator';
import { USER_SERVICE_TOKEN } from '@service/user.service/user.service';
import { IUserService } from '@service/user.service/user.service.interface';
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

    @Authority
    @Put('/:id')
    async updateUser(@Param('id') userId: number, @Body() userUpdate: TUserUpdater): Promise<TUserUpdater> {
        const UPDATED_USER: TUserUpdater = await this._userService.updateUser(userId, userUpdate);
        return UPDATED_USER;
    }

    @Authority
    @Get('/:id')
    async getUser(@Param('id') userId: number): Promise<IUser> {
        const USER: IUser = await this._userService.getUser(userId);
        return USER;
    }

    @Authority
    @Get('/')
    async getAllUsers(): Promise<IUser[]> {
        const USER_LIST: IUser[] = await this._userService.getAllUserList();
        return USER_LIST;
    }
}
