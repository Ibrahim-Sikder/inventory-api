import express from 'express';
import { SaleController } from './sale.controller';
import { SaleValidation } from './sale.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/',
    auth('admin', 'manager', 'employee'),
    validateRequest(SaleValidation.createSaleValidationSchema),
    SaleController.createSale,
);

router.get(
    '/',
    auth('admin', 'employee', 'manager'),
    SaleController.getAllSales,
);

router.get(
    '/:id',
    auth('admin', 'manager', 'employee'),
    SaleController.getSingleSale,
);

export const saleRoutes = router;