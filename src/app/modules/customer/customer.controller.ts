import httpStatus from 'http-status';
import { CustomerServices } from './customer.service';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const createCustomer = catchAsync(async (req, res) => {
    const result = await CustomerServices.createCustomer(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Customer created successfully',
        data: result,
    });
});

const getAllCustomers = catchAsync(async (req, res) => {
    const { meta, result } = await CustomerServices.getAllCustomers(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customers retrieved successfully',
        meta,
        data: result,
    });
});

const getSingleCustomer = catchAsync(async (req, res) => {
    const result = await CustomerServices.getSingleCustomer(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer retrieved successfully',
        data: result,
    });
});

const updateCustomer = catchAsync(async (req, res) => {
    const result = await CustomerServices.updateCustomer(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer updated successfully',
        data: result,
    });
});

const deleteCustomer = catchAsync(async (req, res) => {
    const result = await CustomerServices.deleteCustomer(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer deleted successfully',
        data: result,
    });
});

export const CustomerController = {
    createCustomer,
    getAllCustomers,
    getSingleCustomer,
    updateCustomer,
    deleteCustomer,
};