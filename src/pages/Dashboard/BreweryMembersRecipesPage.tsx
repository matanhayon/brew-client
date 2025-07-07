import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import type { BeerRecipe } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "./DashboardLayout";

const BreweryMembersRecipesPage = () => {
  const { isLoaded } = useUser();
  const { brewery } = useActiveBrewery();

  const [recipes, setRecipes] = useState<BeerRecipe[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch recipes from current brewery's members
  useEffect(() => {
    if (!brewery?.id || !isLoaded) return;

    setLoading(true);
    fetch(
      `${import.meta.env.VITE_API_URL}/recipes/by-brewery-members?brewery_id=${
        brewery.id
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching brewery members' recipes:", error);
        setLoading(false);
      });
  }, [brewery?.id, isLoaded]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-10">
        {/* Header + Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 w-full">
            <Input
              placeholder={`Search ${brewery?.name} members’ recipes...`}
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
        {loading ? (
          <div>Loading recipes...</div>
        ) : filteredRecipes.length === 0 ? (
          <p className="text-muted-foreground">
            No recipes found from {brewery?.name} members.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
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
                      {recipe.targetABV
                        ? `ABV: ${recipe.targetABV}%`
                        : "ABV: -"}{" "}
                      •{" "}
                      {recipe.targetIBU ? `IBU: ${recipe.targetIBU}` : "IBU: -"}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BreweryMembersRecipesPage;
