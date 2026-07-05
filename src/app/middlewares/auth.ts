/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../error/AppError';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { TJwtPayload } from '../modules/auth/auth.utils';

// auth.ts middleware
export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded: TJwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as TJwtPayload;
    } catch {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
    }

    const { userId, role } = decoded;


    // Use findById instead of findOne with userId field
    const user = await User.findOne({ userId });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user no longer exists!');
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This account has been deleted!');
    }

    if (user.status === 'inactive') {
      throw new AppError(httpStatus.FORBIDDEN, 'This account has been blocked!');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You do not have permission to access this resource!',
      );
    }

    req.user = decoded;
    next();
  });
};
