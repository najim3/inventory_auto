/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators/category";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ZodError } from "zod";

function zodErrorToObject(error: ZodError): Record<string, string[]> {
  const tree = error.format();
  const result: Record<string, string[]> = {};

  for (const key in tree) {
    if (key !== "_errors" && "message" in tree[key]) {
      result[key] = [(tree[key] as any).message];
    }
  }

  return result;
}

export async function createCategory(
  prevState: { error?: any; success?: boolean },
  formData: FormData
): Promise<{ error?: any; success?: boolean }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: { auth: ["Unauthorized"] } };
  }

  const name = formData.get("name");
  const parsed = categorySchema.safeParse({ name });

  if (!parsed.success) {
    const errorObject = zodErrorToObject(parsed.error);
    return { error: errorObject };
  }

  await prisma.category.create({
    data: { name: parsed.data.name },
  });

  revalidatePath("/categories");
  return { success: true };
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/categories");
}
