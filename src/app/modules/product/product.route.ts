import express from 'express';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { upload } from '../../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
    '/',
    auth('admin', 'manager',),
    upload,
    validateRequest(ProductValidation.createProductValidationSchema),
    ProductController.createProduct,
);

router.get(
    '/',
    auth('admin', 'manager', 'employee'),
    ProductController.getAllProducts,
);

router.get(
    '/:id',
    auth('admin', 'manager', 'employee'),
    ProductController.getSingleProduct,
);

router.patch(
    '/:id',
    auth('admin', 'manager'),
    upload,
    validateRequest(ProductValidation.updateProductValidationSchema),
    ProductController.updateProduct,
);

router.delete(
    '/:id',
    auth('admin', 'manager',),
    ProductController.deleteProduct,
);

export const productRoutes = router;