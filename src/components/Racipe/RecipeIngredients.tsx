import type { Grain, Hop, Yeast } from "@/api/types";

type Props = {
  grains: Grain[];
  hops: Hop[];
  yeasts: Yeast[];
};

export const RecipeIngredients = ({ grains, hops, yeasts }: Props) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b pb-2">
        Ingredients
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Grains */}
        {grains.length > 0 && (
          <div className="rounded-2xl border shadow-sm p-5 bg-white dark:bg-muted">
            <h3 className="text-lg font-semibold text-primary mb-3">Grains</h3>
            <ul className="space-y-1 text-sm">
              {grains.map(({ name, amount }, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">{amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hops */}
        {hops.length > 0 && (
          <div className="rounded-2xl border shadow-sm p-5 bg-white dark:bg-muted">
            <h3 className="text-lg font-semibold text-primary mb-3">Hops</h3>
            <ul className="space-y-1 text-sm">
              {hops.map(({ name, amount, time }, idx) => (
                <li key={idx} className="flex justify-between">
                  <div>
                    <span className="font-medium">{name}</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      ({time})
                    </span>
                  </div>
                  <span className="text-muted-foreground">{amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Yeasts */}
        {yeasts.length > 0 && (
          <div className="rounded-2xl border shadow-sm p-5 bg-white dark:bg-muted">
            <h3 className="text-lg font-semibold text-primary mb-3">Yeasts</h3>
            <ul className="space-y-1 text-sm">
              {yeasts.map(({ name, temperature }, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="font-medium">{name}</span>
                  {temperature && (
                    <span className="text-muted-foreground text-sm">
                      {temperature}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
