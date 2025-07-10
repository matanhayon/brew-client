import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BeerRecipe } from "@/api/types";

import { RecipeHeader } from "@/components/Racipe/RecipeHeader";
import { RecipeMeta } from "@/components/Racipe/RecipeMeta";
import { RecipeSteps } from "@/components/Racipe/RecipeSteps";
// import { RecipeIngredients } from "@/components/Racipe/RecipeIngredients";
import { RecipeNotes } from "@/components/Racipe/RecipeNotes";
import { RecipeFooter } from "@/components/Racipe/RecipeFooter";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconDroplet, IconGrain, IconPlant } from "@tabler/icons-react";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<BeerRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Recipe not found" : "Failed to fetch recipe"
          );
        }
        return res.json();
      })
      .then((data: BeerRecipe) => setRecipe(data))
      .catch((err) => {
        console.error("Error fetching recipe:", err);
        setError(err.message);
        setRecipe(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="container mx-auto p-10 text-center text-muted-foreground italic">
        Loading recipe...
      </p>
    );
  }

  if (error || !recipe) {
    return (
      <p className="container mx-auto p-10 text-center text-destructive font-medium">
        {error || "Recipe not found."}
      </p>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 rounded-xl shadow-md border">
      <RecipeHeader id={recipe.id} name={recipe.name} style={recipe.style} />

      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full max-w-3xl rounded-lg shadow mb-8 object-cover mx-auto"
          loading="lazy"
        />
      )}

      {recipe.description && (
        <p className="mb-10 text-base sm:text-lg leading-relaxed">
          {recipe.description}
        </p>
      )}

      <RecipeMeta recipe={recipe} />

      {/* <RecipeIngredients
        grains={recipe.grains}
        hops={recipe.hops}
        yeasts={recipe.yeasts}
      /> */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6">Ingredients</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grains Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconGrain className="size-5 text-primary" />
                Grains
              </CardTitle>
              <CardDescription>
                {(recipe.grains?.length ?? 0) > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                    {recipe.grains.map((grain, index) => (
                      <li key={index}>
                        <span className="font-medium text-foreground">
                          {grain.amount}
                        </span>{" "}
                        kg – {grain.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-muted-foreground text-sm">
                    No grains listed.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Hops Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPlant className="size-5 text-green-700" />
                Hops
              </CardTitle>
              <CardDescription>
                {(recipe.hops?.length ?? 0) > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                    {recipe.hops.map((hop, index) => (
                      <li key={index}>
                        <span className="font-medium text-foreground">
                          {hop.amount}
                        </span>{" "}
                        g – {hop.name} ({hop.time} min)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-muted-foreground text-sm">
                    No hops listed.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Yeasts Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconDroplet className="size-5 text-yellow-500" />
                Yeasts
              </CardTitle>
              <CardDescription>
                {(recipe.yeasts?.length ?? 0) > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                    {recipe.yeasts.map((yeast, index) => (
                      <li key={index}>{yeast.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-muted-foreground text-sm">
                    No yeasts listed.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <RecipeSteps
        mashTempC={recipe.mashTempC}
        mashTimeMin={recipe.mashTimeMin}
        boilTimeMin={recipe.boilTimeMin}
        originalGravity={recipe.originalGravity}
        finalGravity={recipe.finalGravity}
      />

      {recipe.notes && <RecipeNotes notes={recipe.notes} />}

      <RecipeFooter brewedCount={recipe.brewedCount} />
    </div>
  );
};

export default RecipeDetail;
