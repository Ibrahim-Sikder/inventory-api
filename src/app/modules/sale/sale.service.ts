import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { AppError } from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/product.model';
import { Customer } from '../customer/customer.model';
import { TCreateSalePayload, TSaleItem } from './sale.interface';
import { Sale } from './sale.model';


const createSale = async (payload: TCreateSalePayload, createdBy: string) => {
    const customer = await Customer.findOne({
        _id: payload.customer,
        isDeleted: false,
    });
    if (!customer) {
        throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const saleItems: TSaleItem[] = [];
        let grandTotal = 0;

        for (const item of payload.items) {
            const product = await Product.findOne({
                _id: item.product,
                isDeleted: false,
            }).session(session);

            if (!product) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    `Product not found: ${item.product}`,
                );
            }

            if (product.stockQuantity < item.quantity) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
                );
            }

            const subtotal = product.sellingPrice * item.quantity;
            grandTotal += subtotal;

            saleItems.push({
                product: product._id!.toString(),
                quantity: item.quantity,
                unitPrice: product.sellingPrice,
                subtotal,
            });


            const updated = await Product.findOneAndUpdate(
                { _id: product._id, stockQuantity: { $gte: item.quantity } },
                { $inc: { stockQuantity: -item.quantity } },
                { new: true, session },
            );

            if (!updated) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    `Insufficient stock for "${product.name}" (stock changed concurrently)`,
                );
            }
        }

        const created = await Sale.create(
            [{ customer: payload.customer, items: saleItems, grandTotal, createdBy }],
            { session },
        );

        await session.commitTransaction();
        return created[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const getAllSales = async (query: Record<string, unknown>) => {
    const saleQuery = new QueryBuilder(
        Sale.find().populate('customer').populate('items.product'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await saleQuery.modelQuery;
    const meta = await saleQuery.countTotal();

    return { meta, result };
};

const getSingleSale = async (id: string) => {
    const result = await Sale.findById(id)
        .populate('customer')
        .populate('items.product');

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Sale not found');
    }
    return result;
};

export const SaleServices = {
    createSale,
    getAllSales,
    getSingleSale,
};