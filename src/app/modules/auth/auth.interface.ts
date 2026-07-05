import { TUserRole } from '../user/user.interface';

export type TLoginUser = {
  credential: string; // email or userId
  password: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: TUserRole;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};