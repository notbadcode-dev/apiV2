export interface IUserCreator {
    username: string;
    applicationId: number;
}

export interface IUserCreate extends IUserCreator {
    password: string;
}

export interface IUserCreated extends IUserCreator {
    id: number;
}
