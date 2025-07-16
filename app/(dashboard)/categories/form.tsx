"use client";

import { useActionState } from "react";
import { createCategory } from "@/lib/actions/category";

const initialState = {
  error: null,
  success: false,
};

export default function CategoryForm() {
  const [state, formAction] = useActionState(createCategory, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Category name"
        className="w-full border p-2 rounded"
      />
      {state?.error?.name && (
        <p className="text-sm text-red-600">{state.error.name}</p>
      )}

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
      >
        Add Category
      </button>

      {state?.success && (
        <p className="text-green-600 text-sm">Category created.</p>
      )}
    </form>
  );
}
