import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BeerRecipe } from "@/api/types";

import { RecipeHeader } from "@/components/Racipe/RecipeHeader";
import { RecipeMeta } from "@/components/Racipe/RecipeMeta";
import { RecipeSteps } from "@/components/Racipe/RecipeSteps";
import { RecipeIngredients } from "@/components/Racipe/RecipeIngredients";
import { RecipeNotes } from "@/components/Racipe/RecipeNotes";
import { RecipeFooter } from "@/components/Racipe/RecipeFooter";

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
          if (res.status === 404) {
            throw new Error("Recipe not found");
          } else {
            throw new Error("Failed to fetch recipe");
          }
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
      <RecipeIngredients ingredients={recipe.ingredients} />
      <RecipeSteps steps={recipe.steps} />
      {recipe.notes && <RecipeNotes notes={recipe.notes} />}
      <RecipeFooter brewedCount={recipe.brewedCount} />
    </div>
  );
};

export default RecipeDetail;
