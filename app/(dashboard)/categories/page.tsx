import { prisma } from "@/lib/prisma";
import { deleteCategory } from "@/lib/actions/category";
import { DeleteConfirm } from "@/components/ui/delete-confirm";
import CategoryForm from "./form";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      <h2 className="text-xl font-semibold">Manage Categories</h2>

      <CategoryForm />

      <ul className="divide-y">
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center justify-between py-2">
            <span>{cat.name}</span>
            <DeleteConfirm
              id={cat.id}
              name={cat.name}
              onDelete={deleteCategory}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
