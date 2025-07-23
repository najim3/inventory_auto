"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBrand } from "@/lib/actions/brand";

type AddBrandDialogProps = {
  brands: { id: string; name: string }[];
};

export default function AddBrandDialog({ brands }: AddBrandDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const formData = new FormData();
    formData.append("name", name);
    await createBrand(formData);
    window.location.reload(); // or router.refresh()
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/80">
          Add Brand
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Brand name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Display the list of brands */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Existing Brands</h3>
          <ul className="list-disc pl-5">
            {brands.map((brand) => (
              <li key={brand.id}>{brand.name}</li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
