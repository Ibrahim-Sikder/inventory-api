import express from 'express';
import { SaleController } from './sale.controller';
import { SaleValidation } from './sale.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.employee),
    validateRequest(SaleValidation.createSaleValidationSchema),
    SaleController.createSale,
);

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