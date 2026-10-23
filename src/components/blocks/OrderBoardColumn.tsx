import type { DragEvent } from "react";
import { Card, CountBadge, EmptyState, type StatusTone } from "../base";
import { cx } from "../cx";

export type BoardTicket = { draggable?: boolean; id: string; subtitle: string; title: string };

type ColumnProps = {
  draggedId?: string | null;
  emptyText: string;
  highlightId?: string | null;
  icon: string;
  isDropTarget?: boolean;
  label: string;
  onDragEnd?: () => void;
  onDragLeave?: (event: DragEvent<HTMLElement>) => void;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDragStart?: (ticket: BoardTicket, event: DragEvent<HTMLElement>) => void;
  onDrop?: (event: DragEvent<HTMLElement>) => void;
  onSelect: (ticket: BoardTicket) => void;
  dropHint?: string;
  tickets: BoardTicket[];
  tone: StatusTone;
};

/** Kanban column for the Cozinha board. The status color matches the Garçom status badge. */
export function OrderBoardColumn({ draggedId, dropHint, emptyText, highlightId, icon, isDropTarget = false, label, onDragEnd, onDragLeave, onDragOver, onDragStart, onDrop, onSelect, tickets, tone }: ColumnProps) {
  const headingId = `board-${label.toLocaleLowerCase("pt-BR").replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={headingId} className={cx("wa-board-column", `wa-board-column--${tone}`, isDropTarget && "wa-board-column--drop-target")} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
      <header className="wa-board-column__header" id={headingId}>
        <span aria-hidden="true">{icon}</span>
        <strong>{label}</strong>
        <CountBadge tone="neutral" value={tickets.length} />
      </header>
      {isDropTarget && dropHint ? <div className="wa-board-column__drop-hint">{dropHint}</div> : null}
      {tickets.length === 0 && !isDropTarget ? <EmptyState title={emptyText} /> : null}
      {tickets.map((ticket) => (
        <Card
          aria-grabbed={ticket.draggable ? draggedId === ticket.id : undefined}
          className={cx("wa-board-ticket", ticket.draggable && "wa-board-ticket--draggable", draggedId === ticket.id && "wa-board-ticket--dragging", highlightId === ticket.id && "wa-board-ticket--entered")}
          draggable={ticket.draggable}
          interactive
          key={ticket.id}
          onClick={() => onSelect(ticket)}
          onDragEnd={onDragEnd}
          onDragStart={(event) => onDragStart?.(ticket, event)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(ticket);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <strong>{ticket.title}</strong>
          <small>{ticket.subtitle}</small>
        </Card>
      ))}
    </section>
  );
}
