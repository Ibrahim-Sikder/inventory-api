import httpStatus from 'http-status';
import { AppError } from '../../error/AppError';
import { ProductServices } from './product.service';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const createProduct = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product image is required!');
    }

    const payload = {
        ...req.body,
        image: `/uploads/products/${req.file.filename}`,
    };

    const result = await ProductServices.createProduct(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
});

const getAllProducts = catchAsync(async (req, res) => {
    const { meta, result } = await ProductServices.getAllProducts(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products retrieved successfully',
        meta,
        data: result,
    });
});

const getSingleProduct = catchAsync(async (req, res) => {
    const result = await ProductServices.getSingleProduct(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: result,
    });
});

const updateProduct = catchAsync(async (req, res) => {
    const payload = { ...req.body };
    if (req.file) {
        payload.image = `/uploads/products/${req.file.filename}`;
    }

    const result = await ProductServices.updateProduct(req.params.id, payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product updated successfully',
        data: result,
    });
});

const deleteProduct = catchAsync(async (req, res) => {
    const result = await ProductServices.deleteProduct(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
});

export const ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};