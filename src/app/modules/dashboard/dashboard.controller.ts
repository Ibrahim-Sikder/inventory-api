import httpStatus from 'http-status';
import { DashboardServices } from './dashboard.service';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const getDashboardStats = catchAsync(async (_req, res) => {
    const result = await DashboardServices.getDashboardStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: result,
    });
});

export const DashboardController = {
    getDashboardStats,
};