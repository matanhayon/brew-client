import { useEffect, useState } from "react";
import type { BeerRecipe } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<BeerRecipe[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/recipes`)
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header + Search + Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Beer Recipes</h1>
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>

        <Link to="/dashboard/build-recipe" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">+ Build Recipe</Button>
        </Link>
      </div>

      {/* Recipe Grid or Loading */}
      {loading ? (
        <p className="text-muted-foreground flex items-center gap-2">
          <Loader className="animate-spin w-4 h-4" />
          Loading recipes...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <Link
              to={`/community/recipes/${recipe.id}`}
              key={recipe.id}
              className="block h-full"
            >
              <Card className="flex flex-col h-full">
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
                <CardContent className="mt-auto">
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
