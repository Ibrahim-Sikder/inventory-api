/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { userRoutes } from '../modules/user/user.route';
import { productRoutes } from '../modules/product/product.route';
import { saleRoutes } from '../modules/sale/sale.route';
import { customerRoutes } from '../modules/customer/customer.route';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';

const router = Router();

const moduleRoutes = [

  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/products',
    route: productRoutes
  },
  {
    path: '/sales',
    route: saleRoutes
  },
  {
    path: '/customers',
    route: customerRoutes
  },
  {
    path: '/dashboard',
    route: dashboardRoutes
  }



];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
