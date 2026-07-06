import httpStatus from 'http-status';
import { UploadApiResponse } from 'cloudinary';
import { AppError } from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { sendImageToCloudinary } from '../../../utils/sendImageToCloudinary';
import { PRODUCT_SEARCHABLE_FIELDS, LOW_STOCK_THRESHOLD } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProduct = async (
    payload: TProduct,
    files: Express.Multer.File[],
) => {
    const existingSku = await Product.findOne({
        sku: payload.sku,
    });

    if (existingSku) {
        throw new AppError(httpStatus.BAD_REQUEST, 'SKU already exists!');
    }

    if (!files || files.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product images are required');
    }


    const imageUrls: string[] = [];
    for (const file of files) {
        const imageName = `${payload.sku}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const uploadResult = await sendImageToCloudinary(
            imageName,
            file.path,
            'products',
        ) as UploadApiResponse;
        imageUrls.push(uploadResult.secure_url);
    }


    return Product.create({
        ...payload,
        images: imageUrls,
    });
};
const getAllProducts = async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(
        Product.find({ isDeleted: false }),
        query,
    )
        .search(PRODUCT_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();

    return { meta, result };
};

const getSingleProduct = async (id: string) => {
    const result = await Product.findOne({ _id: id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return result;
};

const updateProduct = async (
    id: string,
    payload: Partial<TProduct>,
    files?: Express.Multer.File[],
) => {

    if (payload.sku) {
        const existingSku = await Product.findOne({
            sku: payload.sku,
            _id: { $ne: id },
        });

        if (existingSku) {
            throw new AppError(httpStatus.BAD_REQUEST, 'SKU already exists!');
        }
    }

    // Find current product
    const currentProduct = await Product.findOne({
        _id: id,
        isDeleted: false,
    });

    if (!currentProduct) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const updatePayload: Partial<any> = {
        ...payload,
    };


    if (files && files.length > 0) {
        const imageUrls: string[] = [];

        for (const file of files) {
            const imageName = `${payload.sku || currentProduct.sku}-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 7)}`;

            const uploadResult = (await sendImageToCloudinary(
                imageName,
                file.path,
                'products',
            )) as UploadApiResponse;

            imageUrls.push(uploadResult.secure_url);
        }

        updatePayload.images = imageUrls as string[];
    }

    const result = await Product.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false,
        },
        updatePayload,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!result) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Failed to update: product not found',
        );
    }

    return result;
};

const deleteProduct = async (id: string) => {
    const result = await Product.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true },
    );

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Failed to delete: product not found');
    }

    return result;
};

const getLowStockProducts = async () => {
    return Product.find({
        isDeleted: false,
        stockQuantity: { $lt: LOW_STOCK_THRESHOLD },
    });
};

export const ProductServices = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
};