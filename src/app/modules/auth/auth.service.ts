import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../../error/AppError';
import config from '../../config';
import { User } from '../user/user.model';
import { USER_ROLE } from '../user/user.constant';
import { TChangePassword, TLoginUser, TRegisterUser } from './auth.interface';
import { createToken, generateUserId, TJwtPayload } from './auth.utils';

const registerUser = async (payload: TRegisterUser) => {
  const existingEmail = await User.findOne({ email: payload.email });
  if (existingEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is already registered!');
  }

  const userId = await generateUserId();

  const result = await User.create({
    ...payload,
    userId,
    role: payload.role || USER_ROLE.employee,
  });

  const jwtPayload: TJwtPayload = {
    userId: result.userId,
    role: result.role,
    email: result.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      userId: result.userId,
      email: result.email,
      name: result.name,
      role: result.role,
    },
  };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCredential(payload.credential);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been deleted!');
  }

  if (user.status === 'inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been blocked!');
  }

  const isPasswordValid = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  const jwtPayload: TJwtPayload = {
    userId: user.userId,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      needsPasswordChange: user.needsPasswordChange,
    },
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token not found!');
  }

  let decoded: TJwtPayload;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as TJwtPayload;
  } catch {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Invalid or expired refresh token!',
    );
  }

  // Look up by the custom userId field (same fix as the auth middleware).
  const user = await User.findOne({ userId: decoded.userId });
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.status === 'inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been blocked!');
  }

  const jwtPayload: TJwtPayload = {
    userId: user.userId,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

const changePassword = async (
  userData: TJwtPayload,
  payload: TChangePassword,
) => {
  const user = await User.isUserExistsByCredential(userData.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }

  const isOldPasswordValid = await User.isPasswordMatched(
    payload.oldPassword,
    user.password,
  );
  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password does not match');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await User.findOneAndUpdate(
    { userId: userData.userId },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  return result;
};

const getMe = async (userData: TJwtPayload) => {
  const user = await User.findOne({ userId: userData.userId });

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
  getMe,
};