import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
});

export type BrandFormState = {
  errors?: {
    name?: string[];
    _form?: string[];
  };
};
