import httpStatus from 'http-status';
import { TJwtPayload } from '../auth/auth.utils';
import { SaleServices } from './sale.service';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const createSale = catchAsync(async (req, res) => {
    const { userId } = req.user as TJwtPayload;
    const result = await SaleServices.createSale(req.body, userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Sale created successfully',
        data: result,
    });
});

const getAllSales = catchAsync(async (req, res) => {
    const { meta, result } = await SaleServices.getAllSales(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sales retrieved successfully',
        meta,
        data: result,
    });
});

const getSingleSale = catchAsync(async (req, res) => {
    const result = await SaleServices.getSingleSale(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sale retrieved successfully',
        data: result,
    });
});

export const SaleController = {
    createSale,
    getAllSales,
    getSingleSale,
};