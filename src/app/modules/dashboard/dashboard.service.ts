import { Product } from '../product/product.model';
import { Customer } from '../customer/customer.model';
import { Sale } from '../sale/sale.model';
import { LOW_STOCK_THRESHOLD } from '../product/product.constant';

const getDashboardStats = async () => {
    const [totalProducts, totalCustomers, totalSales, lowStockProducts] =
        await Promise.all([
            Product.countDocuments({ isDeleted: false }),
            Customer.countDocuments({ isDeleted: false }),
            Sale.countDocuments(),
            Product.find({
                isDeleted: false,
                stockQuantity: { $lt: LOW_STOCK_THRESHOLD },
            }).select('name sku stockQuantity category'),
        ]);

    return {
        totalProducts,
        totalCustomers,
        totalSales,
        lowStockProducts,
    };
};

export const DashboardServices = {
    getDashboardStats,
};