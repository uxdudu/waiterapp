import { Plus } from "lucide-react";
import { Card, IconButton, Tag, Thumbnail } from "../base";
import { cx } from "../cx";
import { formatCurrency } from "../../lib/format";

export type ProductCardData = { description: string; icon?: string; image?: string; name: string; price: number; tag?: string };

/**
 * Menu item from the Garçom app. `row` is the flat mobile list layout
 * (radius.lg, image as tall as the card); `tile`
 * places the image on top for wider catalog grids.
 */
export function ProductCard({ className, layout = "row", onAdd, onOpen, product }: { className?: string; layout?: "row" | "tile"; onAdd: () => void; onOpen?: () => void; product: ProductCardData }) {
  const content = (
    <>
      <span className="wa-product-card__media">
        <Thumbnail fallback={product.icon} size={layout === "tile" ? "tile" : "md"} src={product.image} />
        {product.tag && layout === "tile" ? <Tag className="wa-product-card__tag" tone="inverse">{product.tag}</Tag> : null}
      </span>
      <span className="wa-product-card__copy">
        <span className="wa-product-card__name">{product.name}</span>
        <span className="wa-product-card__description">{product.description}</span>
        <span className="wa-product-card__price">{formatCurrency(product.price)}</span>
      </span>
    </>
  );

  return (
    <Card className={cx("wa-product-card", `wa-product-card--${layout}`, className)} elevation={layout === "row" ? "flat" : "raised"} radius={layout === "row" ? "lg" : "sm"}>
      {onOpen ? (
        <button aria-label={`Ver detalhes de ${product.name}`} className="wa-product-card__body" onClick={onOpen} type="button">{content}</button>
      ) : (
        <div className="wa-product-card__body">{content}</div>
      )}
      <IconButton className="wa-product-card__add" label={`Adicionar ${product.name} ao pedido`} onPress={onAdd}>
        <Plus aria-hidden="true" size={layout === "row" ? 16 : 20} strokeWidth={2} />
      </IconButton>
    </Card>
  );
}
