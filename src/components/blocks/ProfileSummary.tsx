import { Pencil, Phone } from "lucide-react";
import { Button, Card, Tag } from "../base";

export type ProfileData = { name: string; phone: string; avatar?: string };

/** Identity block with an initials avatar and the shared edit action. */
export function ProfileSummary({ onEdit, profile, role }: { onEdit: () => void; profile: ProfileData; role: string }) {
  const initials = profile.name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).filter((_, index, parts) => index === 0 || index === parts.length - 1).join("").toLocaleUpperCase("pt-BR");
  return (
    <Card className="wa-profile-summary" elevation="flat" radius="lg">
      <span aria-hidden="true" className={`wa-profile-summary__avatar${profile.avatar ? " wa-profile-summary__avatar--image" : ""}`}>{profile.avatar ? <img alt="" src={profile.avatar} /> : initials}</span>
      <div className="wa-profile-summary__identity">
        <h2>{profile.name}</h2>
        <Tag className="wa-profile-summary__role" tone="neutral">{role}</Tag>
        <p><Phone aria-hidden="true" size={16} />{profile.phone}</p>
      </div>
      <Button onPress={onEdit} variant="glass"><Pencil aria-hidden="true" size={16} />Editar perfil</Button>
    </Card>
  );
}
