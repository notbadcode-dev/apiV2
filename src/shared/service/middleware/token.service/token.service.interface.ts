import { IUser } from '@model/user/user.model';

export interface ITokenService {
    sign(userId: number): string;

    decode(token: string): { userId: number } | null;

    refresh(token: string): string | null;

    setCurrentUser(userId: number): Promise<void>;

    getCurrentUser(): IUser | null;

    getCurrentUserId(): number;

    verify(token: string): number | null;

    expireToken(token: string): void;
}
