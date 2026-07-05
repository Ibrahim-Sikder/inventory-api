import httpStatus from 'http-status';
import { AppError } from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: TUser) => {
  const existingEmail = await User.findOne({ email: payload.email });
  if (existingEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is already registered!');
  }

  const existingUserId = await User.findOne({ userId: payload.userId });
  if (existingUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID is already taken!');
  }

  // Password hashing is handled by the pre-save hook on the model.
  const result = await User.create(payload);
  return result;
};

const getAllUsers = async () => {
  return User.find({ isDeleted: false });
};

const getSingleUser = async (id: string) => {
  const result = await User.findById(id);

  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};

const updateUser = async (id: string, payload: Partial<TUser>) => {
  // Password changes must go through the dedicated change-password flow,
  // never through a generic PATCH (avoids accidentally saving a plaintext
  // password since findByIdAndUpdate skips the pre-save hashing hook).
  delete payload.password;

  const result = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to update user');
  }

  return result;
};

const deleteUser = async (id: string) => {
  // Soft delete, consistent with isDeleted flag used throughout the app.
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to delete user');
  }

  return result;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
