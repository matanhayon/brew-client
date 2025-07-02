import { useEffect, useState } from "react";
import type { BeerRecipe } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<BeerRecipe[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  const filtered = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Beer Recipes</h1>
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No recipes found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <Link
              to={`/community/recipes/${recipe.id}`}
              key={recipe.id}
              className="block hover:shadow-md transition overflow-hidden rounded"
            >
              <Card>
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="h-48 w-full object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{recipe.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {recipe.style}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{recipe.description}</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    {recipe.targetABV ? `ABV: ${recipe.targetABV}%` : "ABV: -"}{" "}
                    • {recipe.targetIBU ? `IBU: ${recipe.targetIBU}` : "IBU: -"}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
