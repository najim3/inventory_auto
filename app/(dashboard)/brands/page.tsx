import { getAllBrands } from "@/lib/actions/brand";
import AddBrandDialog from "@/components/pages/AddBrandDialog";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function BrandsPage() {
  const brands = await getAllBrands();
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <AddBrandDialog brands={brands} />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
        {brands.length === 0 ? (
          <p className="text-gray-500 text-center">No brands found.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {brands.map((brand) => (
              <li key={brand.id} className="flex items-center justify-between py-4">
                <span className="font-medium text-lg">{brand.name}</span>
                <div className="flex gap-2">
                  <a
                    href={`/brands/${brand.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </a>
                  <form action={`/api/brands/${brand.id}/delete`} method="POST">
                    <button
                      type="submit"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.brand.delete({
      where: { id: params.id },
    });
    return NextResponse.redirect("/brands", { status: 303 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
