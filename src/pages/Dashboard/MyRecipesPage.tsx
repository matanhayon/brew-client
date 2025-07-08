import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import type { BeerRecipe } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MyRecipesPage = () => {
  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState<BeerRecipe[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoaded) return; // wait for user to load

    fetch(`${import.meta.env.VITE_API_URL}/recipes`)
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, [isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>; // or a spinner
  }

  // Filter by current user's user_id and search term
  const myRecipes = recipes.filter(
    (recipe) =>
      recipe.user_id === user?.id &&
      recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header + Search + Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <Input
            placeholder="Search my recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>

        <Link to="/dashboard/build-recipe" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">+ Build New Recipe</Button>
        </Link>
      </div>

      {/* Recipe Grid */}
      {myRecipes.length === 0 ? (
        <p className="text-muted-foreground">
          You haven’t created any recipes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRecipes.map((recipe) => (
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

export default MyRecipesPage;
