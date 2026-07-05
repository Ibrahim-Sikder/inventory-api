import express from 'express';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { upload } from '../../../utils/sendImageToCloudinary';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Admin: full access | Manager: manage products | Employee: view only
router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.manager),
    upload, // multer -> local tmp file -> service uploads it to Cloudinary
    validateRequest(ProductValidation.createProductValidationSchema),
    ProductController.createProduct,
);

router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.employee),
    ProductController.getAllProducts,
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.employee),
    ProductController.getSingleProduct,
);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.manager),
    upload,
    validateRequest(ProductValidation.updateProductValidationSchema),
    ProductController.updateProduct,
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.manager),
    ProductController.deleteProduct,
);

export const productRoutes = router;