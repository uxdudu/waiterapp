import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, SegmentedControl } from "../base";
import { PageHeader } from "./PageHeader";

export type PerformanceMetric = { icon: LucideIcon; label: string; value: string };
export type PerformancePeriod = "today" | "month";

/** Period selector and a semantic list of service metrics. Values belong to the consumer. */
export function PerformanceSummary({ description, metrics, onPeriodChange, period }: { description: string; metrics: PerformanceMetric[]; onPeriodChange: (value: PerformancePeriod) => void; period: PerformancePeriod }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="wa-performance-summary">
      <PageHeader level={2} title={<span id={headingId}>Seu atendimento</span>} />
      <SegmentedControl fullWidth label="Período do resumo" onChange={onPeriodChange} options={[{ id: "today", label: "Hoje" }, { id: "month", label: "Este mês" }]} value={period} />
      <Card className="wa-performance-summary__card" elevation="flat" radius="lg">
        <p className="wa-performance-summary__period">{description}</p>
        <dl className="wa-performance-summary__metrics">
          {metrics.map(({ icon: Icon, label, value }) => (
            <div className="wa-performance-summary__metric" key={label}>
              <dt><Icon aria-hidden="true" size={20} strokeWidth={1.8} />{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="wa-performance-summary__note">Faturamento dos pedidos atendidos por você.</p>
      </Card>
    </section>
  );
}
