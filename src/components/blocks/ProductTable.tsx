import { Pencil, Trash2 } from "lucide-react";
import { Card, IconButton, Thumbnail } from "../base";
import { formatCurrency } from "../../lib/format";

export type ProductTableRow = { category: string; categoryIcon?: string; id: string; image?: string; name: string; price: number };

/** Product management table for the Cozinha web app. Collapses into cards on narrow screens. */
export function ProductTable({ onDelete, onEdit, rows }: { onDelete: (row: ProductTableRow) => void; onEdit: (row: ProductTableRow) => void; rows: ProductTableRow[] }) {
  return (
    <Card className="wa-product-table" role="table">
      <div className="wa-product-table__row wa-product-table__row--header" role="row">
        <span role="columnheader">Imagem</span>
        <span role="columnheader">Nome</span>
        <span role="columnheader">Categoria</span>
        <span role="columnheader">Preço</span>
        <span role="columnheader">Ações</span>
      </div>
      {rows.map((row) => (
        <div className="wa-product-table__row" key={row.id} role="row">
          <span role="cell"><Thumbnail size="sm" src={row.image} /></span>
          <span className="wa-product-table__name" role="cell">{row.name}</span>
          <span role="cell">{row.categoryIcon ? <span aria-hidden="true">{row.categoryIcon} </span> : null}{row.category}</span>
          <span className="wa-product-table__price" role="cell">{formatCurrency(row.price)}</span>
          <span className="wa-product-table__actions" role="cell">
            <IconButton label={`Editar ${row.name}`} onPress={() => onEdit(row)}><Pencil aria-hidden="true" size={18} strokeWidth={1.8} /></IconButton>
            <IconButton label={`Excluir ${row.name}`} onPress={() => onDelete(row)}><Trash2 aria-hidden="true" size={18} strokeWidth={1.8} /></IconButton>
          </span>
        </div>
      ))}
    </Card>
  );
}
