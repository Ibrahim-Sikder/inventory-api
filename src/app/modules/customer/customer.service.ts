import httpStatus from 'http-status';
import { AppError } from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCustomer } from './customer.interface';
import { Customer } from './customer.model';

const CUSTOMER_SEARCHABLE_FIELDS = ['name', 'phone', 'email'];

const createCustomer = async (payload: TCustomer) => {
    const existingPhone = await Customer.findOne({ phone: payload.phone });
    if (existingPhone) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Phone number already registered!');
    }
    return Customer.create(payload);
};

const getAllCustomers = async (query: Record<string, unknown>) => {
    const customerQuery = new QueryBuilder(
        Customer.find({ isDeleted: false }),
        query,
    )
        .search(CUSTOMER_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await customerQuery.modelQuery;
    const meta = await customerQuery.countTotal();

    return { meta, result };
};

const getSingleCustomer = async (id: string) => {
    const result = await Customer.findOne({ _id: id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');
    }
    return result;
};

const updateCustomer = async (id: string, payload: Partial<TCustomer>) => {
    const result = await Customer.findOneAndUpdate(
        { _id: id, isDeleted: false },
        payload,
        { new: true, runValidators: true },
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Failed to update: customer not found');
    }
    return result;
};

const deleteCustomer = async (id: string) => {
    const result = await Customer.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true },
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Failed to delete: customer not found');
    }
    return result;
};

export const CustomerServices = {
    createCustomer,
    getAllCustomers,
    getSingleCustomer,
    updateCustomer,
    deleteCustomer,
};