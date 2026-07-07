import express from 'express';
import { DashboardController } from './dashboard.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();
router.get(
    '/stats',
    auth('admin', 'employee', 'manager'),
    DashboardController.getDashboardStats,
);

export const dashboardRoutes = router;