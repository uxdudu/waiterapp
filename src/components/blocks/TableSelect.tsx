import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FilterChip } from "../base";
import { cx } from "../cx";

/** Table selector from the Garçom order screen: a field that expands into quick choices. */
export function TableSelect({ onChange, options, value }: { onChange: (table: string) => void; options: string[]; value: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="wa-table-select">
      <button aria-controls="table-options" aria-expanded={open} className="wa-table-select__trigger" onClick={() => setOpen((current) => !current)} type="button">
        <span>{value}</span>
        <ChevronDown aria-hidden="true" className={cx("wa-table-select__chevron", open && "wa-table-select__chevron--open")} size={18} strokeWidth={2} />
      </button>
      {open ? (
        <div aria-label="Selecionar mesa" className="wa-table-select__options" id="table-options" role="listbox">
          {options.map((option) => (
            <FilterChip key={option} onPress={() => { onChange(option); setOpen(false); }} role="option" selected={option === value}>{option}</FilterChip>
          ))}
        </div>
      ) : null}
    </div>
  );
}
