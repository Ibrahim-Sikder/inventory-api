import { z } from 'zod';
import { USER_ROLE, USER_STATUS } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is required' }),
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    role: z.enum([USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.employee], {
      required_error: 'Role is required',
    }),
    status: z.enum(USER_STATUS).optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z
      .enum([USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.employee])
      .optional(),
    status: z.enum(USER_STATUS).optional(),
    // Password intentionally NOT accepted here — use /auth/change-password
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
