export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatItemCount(count: number) {
  return `${count} ${count === 1 ? "item" : "itens"}`;
}
