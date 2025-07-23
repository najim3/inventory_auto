// src/components/SubmitButton.tsx
"use client"; // This component also needs "use client" because it uses a React Hook

import { useFormStatus } from "react-dom";
import React from "react"; // Ensure React is imported if using JSX

export function SubmitButton() {
  const { pending } = useFormStatus(); // This hook is now correctly inside a child component of the form

  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      {pending ? "Creating..." : "Create"}
    </button>
  );
}
