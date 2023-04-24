/* eslint-disable @typescript-eslint/ban-types */
import { ApplicationEntity } from './application.entity';
import { UserApplicationEntity } from './user-application.entity';
import { UserEntity } from './user.entity';

export const AUTH_API_ENTITY_LIST: Function[] = [UserEntity, ApplicationEntity, UserApplicationEntity];
