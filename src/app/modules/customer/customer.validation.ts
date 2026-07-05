import { z } from 'zod';

const createCustomerValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Customer name is required' }),
        phone: z.string({ required_error: 'Phone number is required' }),
        email: z.string().email('Invalid email address').optional(),
        address: z.string().optional(),
    }),
});

const updateCustomerValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email('Invalid email address').optional(),
        address: z.string().optional(),
    }),
});

export const CustomerValidation = {
    createCustomerValidationSchema,
    updateCustomerValidationSchema,
};