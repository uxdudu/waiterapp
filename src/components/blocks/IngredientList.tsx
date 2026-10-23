/** Ingredient rows on the Garçom item detail. */
export function IngredientList({ icon = "🧀", items, title = "Ingredientes" }: { icon?: string; items: string[]; title?: string }) {
  return (
    <section aria-labelledby="ingredients-heading" className="wa-ingredient-list">
      <h2 id="ingredients-heading">{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}><span aria-hidden="true">{icon}</span>{item}</li>
        ))}
      </ul>
    </section>
  );
}
