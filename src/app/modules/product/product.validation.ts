import { z } from "zod";

// Post validation schema
export const createProductSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  description: z.string().min(1, "Product title is required"),
  photos: z.object({
    thumbnail: z.string().min(1, "Thumbnail image url is required"),
    cover: z.string().min(1, "Cover image url is required"),
  }),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().nonnegative(),
  price: z.number().nonnegative(),
  stock: z.number().nonnegative(),
  discount: z.number().nonnegative(),
});
export const updateProductSchema = z.object({
  title: z.string().min(1, "Product title is required").optional(),
  description: z.string().min(1, "Product title is required").optional(),
  photos: z
    .object({
      thumbnail: z.string().min(1, "Thumbnail image url is required"),
      cover: z.string().min(1, "Cover image url is required"),
    })
    .optional(),
  category: z.string().min(1, "Category is required").optional(),
  quantity: z.number().nonnegative().optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
});

export const productSchema = {
  createProductSchema,
  updateProductSchema,
};
