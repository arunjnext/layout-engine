import { z } from 'zod';

/**
 * Zod schema for validating work experience entries
 * Used with react-hook-form for type-safe form validation
 */
export const experienceSchema = z.object({
  _id: z.string(),
  title: z
    .string()
    .min(1, 'Job title is required')
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must be less than 100 characters'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .regex(
      /^(Present|present|\d{4}(-\d{2})?|[A-Za-z]{3,9}\s+\d{4})$/,
      'Invalid date format (e.g., "2021-06", "Jan 2021", or "Present")'
    ),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .regex(
      /^(Present|present|\d{4}(-\d{2})?|[A-Za-z]{3,9}\s+\d{4})$/,
      'Invalid date format (e.g., "2024-12", "Dec 2024", or "Present")'
    ),
  intro: z
    .string()
    .min(1, 'Introduction is required')
    .min(10, 'Introduction must be at least 10 characters')
    .max(500, 'Introduction must be less than 500 characters'),
  description: z.array(z.string()),
});

/**
 * TypeScript type inferred from the Zod schema
 * This ensures type safety throughout the application
 */
export type ExperienceFormData = z.infer<typeof experienceSchema>;

/**
 * Schema for validating the description array items
 * Used for dynamic field arrays in the form
 */
export const descriptionItemSchema = z.object({
  value: z.string().min(1, 'Achievement cannot be empty'),
});

export type DescriptionItemData = z.infer<typeof descriptionItemSchema>;

