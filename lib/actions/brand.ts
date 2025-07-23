"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { brandSchema, BrandFormState } from "@/lib/validators/brand";
import { redirect } from "next/navigation";

export async function createBrand(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name || typeof name !== "string") return;

  await prisma.brand.create({ data: { name } });
  revalidatePath("/brands");
}

export async function updateBrand(
  id: string,
  prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const parsed = brandSchema.safeParse({ name: formData.get("name") });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.brand.update({ where: { id }, data: parsed.data });
  } catch {
    return { errors: { name: ["Failed to update brand."] } };
  }

  revalidatePath("/brands");
  redirect("/brands");
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/dashboard/brands");
  } catch (error) {
    console.error("Failed to delete brand:", error);
    throw new Error("Failed to delete brand");
  }
}

export async function getAllBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }
}
