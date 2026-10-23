import { useState } from "react";
import { Banknote, ReceiptText, UsersRound } from "lucide-react";
import { OpenOrdersCard, PageHeader, PerformanceSummary, ProfileSummary, type PerformancePeriod, type ProfileData } from "../components/blocks";
import { formatCurrency } from "../lib/format";
import { sampleWaiterPerformance } from "./garcom-profile-data";

export function GarcomProfile({ onEdit, onOpenOrders, openOrderCount, profile }: { onEdit: () => void; onOpenOrders: () => void; openOrderCount: number; profile: ProfileData }) {
  const [period, setPeriod] = useState<PerformancePeriod>("month");
  const performance = sampleWaiterPerformance[period];
  const now = new Date();
  const description = period === "month"
    ? now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : now.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });

  return (
    <main className="garcom-section garcom-profile">
      <PageHeader title="Meu Perfil" />
      <div className="garcom-profile__layout">
        <ProfileSummary onEdit={onEdit} profile={profile} role="Garçom" />
        <div className="garcom-profile__activity">
          <PerformanceSummary description={description} metrics={[
            { icon: Banknote, label: "Faturamento", value: formatCurrency(performance.revenue) },
            { icon: UsersRound, label: "Atendimentos", value: String(performance.services) },
            { icon: ReceiptText, label: "Pedidos feitos", value: String(performance.orders) },
          ]} onPeriodChange={setPeriod} period={period} />
          <OpenOrdersCard count={openOrderCount} onOpen={onOpenOrders} />
        </div>
      </div>
    </main>
  );
}
