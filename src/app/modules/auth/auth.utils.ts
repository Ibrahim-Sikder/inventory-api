import jwt, { SignOptions } from 'jsonwebtoken';
import { TUserRole } from '../user/user.interface';
import { User } from '../user/user.model';

export type TJwtPayload = {
  userId: string;
  email: string;
  role: TUserRole;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const signOptions: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(jwtPayload, secret, signOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as TJwtPayload & {
    iat: number;
    exp: number;
  };
};

// Generates sequential ids like "001", "002", "003" ...
export const generateUserId = async (): Promise<string> => {
  const lastUser = await User.findOne().sort({ userId: -1 });

  let nextId = 1;
  if (lastUser && lastUser.userId) {
    const match = lastUser.userId.match(/\d+$/);
    if (match) {
      nextId = parseInt(match[0], 10) + 1;
    }
  }

  return String(nextId).padStart(3, '0');
};