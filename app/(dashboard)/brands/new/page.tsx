"use client";

import { createBrand } from "@/lib/actions/brand";
import React from "react";

import { useFormStatus } from "react-dom";

const initialState = { message: null };

export default function NewBrandPage() {
  const [state, formAction] = React.useActionState(createBrand, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Enter brand name"
        required
        className="w-full rounded border p-2"
      />
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Creating..." : "Create"}
      </button>
      {state?.message && <p className="text-red-500">{state.message}</p>}
    </form>
  );
}
