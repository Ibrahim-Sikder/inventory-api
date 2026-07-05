import express from 'express';
import { CustomerController } from './customer.controller';
import { CustomerValidation } from './customer.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Admin: full access | Manager: manage customers
// Employee: read-only (needed to pick a customer on the Create Sale page)
router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.manager),
    validateRequest(CustomerValidation.createCustomerValidationSchema),
    CustomerController.createCustomer,
);

router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.employee),
    CustomerController.getAllCustomers,
);

router.get(
    '/:id',
    auth('admin', 'manager', 'employee'),
    CustomerController.getSingleCustomer,
);

router.patch(
    '/:id',
    auth('manager', 'admin'),
    validateRequest(CustomerValidation.updateCustomerValidationSchema),
    CustomerController.updateCustomer,
);

router.delete(
    '/:id',
    auth('admin', 'manager'),
    CustomerController.deleteCustomer,
);

export const customerRoutes = router;