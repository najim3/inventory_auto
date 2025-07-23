"use client";

import { prisma } from "@/lib/prisma";
import { updateBrand } from "@/lib/actions/brand";
import { useFormState } from "react-dom";

export default async function EditBrandPage({
  params,
}: {
  params: { id: string };
}) {
  const brand = await prisma.brand.findUnique({ where: { id: params.id } });

  if (!brand) {
    return <p className="p-4">Brand not found</p>;
  }

  return <EditForm brand={brand} />;
}

function EditForm({ brand }: { brand: { id: string; name: string } }) {
  const updateAction = updateBrand.bind(null, brand.id);
  const [state, action] = useFormState(updateAction, {});

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Brand</h1>
      <form action={action} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brand Name</label>
          <input
            name="name"
            defaultValue={brand.name}
            className="w-full border rounded px-3 py-2"
            required
          />
          {state.errors?.name && (
            <p className="text-red-600 text-sm">{state.errors.name[0]}</p>
          )}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
