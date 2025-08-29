import { z } from 'zod';

export const QueryBooksSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  from: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const year = parseInt(val, 10);
        return !isNaN(year) && year >= 1000 && year <= new Date().getFullYear();
      },
      {
        message:
          'From year must be a valid number between 1000 and current year',
      },
    ),
  to: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const year = parseInt(val, 10);
        return !isNaN(year) && year >= 1000 && year <= new Date().getFullYear();
      },
      {
        message: 'To year must be a valid number between 1000 and current year',
      },
    ),
});

export type QueryBooksDto = z.infer<typeof QueryBooksSchema>;
