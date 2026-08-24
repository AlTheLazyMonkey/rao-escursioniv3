import { EscursioneForm } from "@/components/admin/EscursioneForm";
import { creaEscursione } from "@/lib/admin/actions";

export default function NuovaEscursionePage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nuova escursione</h1>
      <div className="mt-7 max-w-2xl rounded-card bg-page p-2">
        <EscursioneForm azione={creaEscursione} />
      </div>
    </div>
  );
}
