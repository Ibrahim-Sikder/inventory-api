import express from 'express';
import { CustomerController } from './customer.controller';
import { CustomerValidation } from './customer.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';

const router = express.Router();


router.post(
    '/',
    auth('admin', 'manager'),
    validateRequest(CustomerValidation.createCustomerValidationSchema),
    CustomerController.createCustomer,
);

router.get(
    '/',
    auth('admin', 'manager', 'employee'),
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