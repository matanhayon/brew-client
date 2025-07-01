export const RecipeIngredients = ({
  ingredients,
}: {
  ingredients: {
    type: string;
    name: string;
    amount: string;
  }[];
}) => {
  const grouped = ingredients.reduce((acc, ingredient) => {
    const { type } = ingredient;
    if (!acc[type]) acc[type] = [];
    acc[type].push(ingredient);
    return acc;
  }, {} as Record<string, typeof ingredients>);

  return (
    <section className="mb-12">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b pb-2">
        Ingredients
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {Object.entries(grouped).map(([type, items]) => (
          <div
            key={type}
            className="rounded-2xl border shadow-sm p-5 bg-white dark:bg-muted"
          >
            <h3 className="text-lg font-semibold text-primary mb-3">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
            <ul className="space-y-1 text-sm">
              {items.map(({ name, amount }, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">{amount}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
