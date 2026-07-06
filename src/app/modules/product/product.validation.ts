import { z } from 'zod';

const createProductValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Product name is required' }),
        sku: z.string({ required_error: 'SKU is required' }),
        category: z.string({ required_error: 'Category is required' }),
        purchasePrice: z.coerce
            .number({ required_error: 'Purchase price is required' })
            .nonnegative(),
        sellingPrice: z.coerce
            .number({ required_error: 'Selling price is required' })
            .nonnegative(),
        stockQuantity: z.coerce
            .number({ required_error: 'Stock quantity is required' })
            .nonnegative(),
    }),
});

const updateProductValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        sku: z.string().optional(),
        category: z.string().optional(),
        purchasePrice: z.coerce.number().nonnegative().optional(),
        sellingPrice: z.coerce.number().nonnegative().optional(),
        stockQuantity: z.coerce.number().nonnegative().optional(),
    }),
});

export const ProductValidation = {
    createProductValidationSchema,
    updateProductValidationSchema,
};