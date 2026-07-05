import { z } from 'zod';

const createSaleValidationSchema = z.object({
    body: z.object({
        customer: z.string({ required_error: 'Customer is required' }),
        items: z
            .array(
                z.object({
                    product: z.string({ required_error: 'Product is required' }),
                    quantity: z.coerce
                        .number({ required_error: 'Quantity is required' })
                        .int()
                        .positive('Quantity must be at least 1'),
                }),
            )
            .nonempty('At least one product is required'),
    }),
});

export const SaleValidation = {
    createSaleValidationSchema,
};