"use client";

import Link from "next/link";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { deleteBrand } from "@/lib/actions/brand";

interface Brand {
  id: string;
  name: string;
}

interface Props {
  brands: Brand[];
}

export function BrandsPageClient({ brands }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Link href="/brands/new">
          <Button className="bg-primary text-white">Add Brand</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <span>{brand.name}</span>

            <div className="flex gap-2">
              <Link href={`/brands/${brand.id}/edit`}>
                <Button variant="outline" size="sm">
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>

              <ConfirmDeleteDialog
                onConfirm={() => deleteBrand(brand.id)} // brand.id is a string ✅
                triggerText="Delete"
                title={`Delete ${brand.name}?`}
                description="This action cannot be undone."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
