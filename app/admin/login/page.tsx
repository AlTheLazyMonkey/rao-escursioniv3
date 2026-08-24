import { LoginForm } from "@/components/admin/LoginForm";

// Reso dinamico deliberatamente: essendo protetta dal proxy insieme al
// resto di /admin, non ha senso pre-renderizzarla staticamente in build.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-5">
      <LoginForm />
    </div>
  );
}
