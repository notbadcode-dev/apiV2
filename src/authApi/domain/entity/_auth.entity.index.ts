/* eslint-disable @typescript-eslint/ban-types */
import { ApplicationEntity } from '@entity/application.entity';
import { UserApplicationEntity } from '@entity/user-application.entity';
import { UserEntity } from '@entity/user.entity';

export const AUTH_API_ENTITY_LIST: Function[] = [UserEntity, ApplicationEntity, UserApplicationEntity];
