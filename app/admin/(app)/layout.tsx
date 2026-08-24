import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Il proxy (proxy.ts) protegge già /admin, ma ricontrolliamo anche qui:
  // difesa in profondità, e serve comunque a leggere l'utente per la UI.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-page">
      <AdminNav email={user.email ?? null} />
      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-10">{children}</main>
    </div>
  );
}
