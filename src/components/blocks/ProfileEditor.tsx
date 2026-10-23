import { useId, useState } from "react";
import { Button, InlineNotice, TextField } from "../base";
import { SidePanel } from "./SidePanel";
import type { ProfileData } from "./ProfileSummary";

/** Profile form composed with the shared modal panel and actions. Saves through the consumer. */
export function ProfileEditor({ onClose, onSave, profile }: { onClose: () => void; onSave: (profile: ProfileData) => void; profile: ProfileData }) {
  const formId = useId();
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  return (
    <SidePanel title="Editar perfil" onClose={onClose} footer={<><Button form={formId} size="lg" type="submit">Salvar alterações</Button><Button onPress={onClose} variant="secondary">Cancelar</Button></>}>
      <form className="wa-profile-editor" id={formId} onSubmit={(event) => {
        event.preventDefault();
        const name = draft.name.trim();
        const phone = draft.phone.trim();
        if (name.length < 2) { setError("Informe um nome com pelo menos 2 caracteres."); return; }
        if (![10, 11].includes(phone.replace(/\D/g, "").length)) { setError("Informe um telefone com DDD e 10 ou 11 dígitos."); return; }
        onSave({ ...profile, name, phone });
      }}>
        <p>Como você aparece no seu perfil.</p>
        <TextField autoComplete="name" label="Nome" maxLength={60} name="name" onChange={(name) => { setDraft({ ...draft, name }); setError(""); }} required value={draft.name} />
        <TextField autoComplete="tel" label="Telefone" maxLength={20} name="phone" onChange={(phone) => { setDraft({ ...draft, phone }); setError(""); }} required type="tel" value={draft.phone} />
        {error ? <p className="wa-profile-editor__error" role="alert">{error}</p> : null}
        <InlineNotice>Alterações de demonstração, válidas enquanto você usa esta página.</InlineNotice>
      </form>
    </SidePanel>
  );
}
