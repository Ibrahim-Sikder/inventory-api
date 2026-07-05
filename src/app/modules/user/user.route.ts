import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

router.get('/', auth('admin'), UserController.getAllUsers);

router.get('/:id', auth('admin'), UserController.getSingleUser);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

router.delete('/:id', auth('admin'), UserController.deleteUser);

export const userRoutes = router;
