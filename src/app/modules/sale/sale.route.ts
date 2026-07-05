import express from 'express';
import { SaleController } from './sale.controller';
import { SaleValidation } from './sale.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Admin: full access | Manager: create sales | Employee: create sales
// (Manager and Employee both have "Create Sales" permission per the spec)
router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.employee),
    validateRequest(SaleValidation.createSaleValidationSchema),
    SaleController.createSale,
);

// Sale history — admin/manager only makes sense for viewing all records;
// adjust to include employee if they should see their own sales too.
router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.manager),
    SaleController.getAllSales,
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.manager),
    SaleController.getSingleSale,
);

export const saleRoutes = router;