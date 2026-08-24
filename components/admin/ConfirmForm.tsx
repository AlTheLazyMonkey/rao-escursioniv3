"use client";

import type { ReactNode } from "react";

export function ConfirmForm({
  action,
  messaggio,
  className = "",
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  messaggio: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(messaggio)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
