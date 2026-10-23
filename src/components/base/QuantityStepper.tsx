import { Minus, Plus } from "lucide-react";
import { cx } from "../cx";
import { IconButton } from "./IconButton";

export type QuantityStepperProps = {
  className?: string;
  itemName: string;
  minQuantity?: number;
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
  showValue?: boolean;
};

/** Add and remove controls used by every order line (Garçom order, Cozinha drawer, Delivery cart). */
export function QuantityStepper({ className, itemName, minQuantity = 0, onDecrement, onIncrement, quantity, showValue = true }: QuantityStepperProps) {
  return (
    <div aria-label={`Quantidade de ${itemName}`} className={cx("wa-quantity-stepper", className)} role="group">
      <IconButton label={`Adicionar ${itemName}`} onPress={onIncrement}>
        <Plus aria-hidden="true" size={18} strokeWidth={2} />
      </IconButton>
      {showValue && <output aria-live="polite" className="wa-quantity-stepper__value">{quantity}</output>}
      <IconButton isDisabled={quantity <= minQuantity} label={`Remover ${itemName}`} onPress={onDecrement}>
        <Minus aria-hidden="true" size={18} strokeWidth={2} />
      </IconButton>
    </div>
  );
}
