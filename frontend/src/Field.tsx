import React from "react";

export function Field({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      {children} {error && <small className="text-red-300">{error}</small>}
    </div>
  );
}
