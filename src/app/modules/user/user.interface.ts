import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = 'active' | 'inactive';

export type TUser = {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  status: TUserStatus;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByCredential(
    credential: string,
  ): Promise<(TUser & { password: string }) | null>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
