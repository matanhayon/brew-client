import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Brew = {
  id: string | number;
  created_at: string;
  status: "pending" | "in_progress" | "completed";
  notes: string;
  recipe_snapshot: {
    id: string | number;
    name: string;
    style?: string;
    imageUrl?: string;
    targetABV?: number;
    targetIBU?: number;
    description?: string;
  };
  abv?: number;
  original_gravity?: number;
  final_gravity?: number;
};

const BreweryBrewsPage = () => {
  const { isLoaded } = useUser();
  const { brewery } = useActiveBrewery();

  const [brews, setBrews] = useState<Brew[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brewery?.id || !isLoaded) return;

    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/brews?brewery_id=${brewery.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBrews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching brews:", error);
        setLoading(false);
      });
  }, [brewery?.id, isLoaded]);

  // Filter brews by recipe name or notes, case-insensitive
  const filteredBrews = brews.filter((brew) => {
    const name = brew.recipe_snapshot?.name ?? "";
    const notes = brew.notes ?? "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      notes.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header + Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-3xl font-bold">
            {brewery?.name ? `${brewery.name} Brews` : "Brewery Brews"}
          </h1>

          <Input
            placeholder={`Search brews by recipe name or notes...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>

        <Link to="/dashboard/start-brew" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">+ Start New Brew</Button>
        </Link>
      </div>

      {/* Brews Grid */}
      {loading ? (
        <div>Loading brews...</div>
      ) : filteredBrews.length === 0 ? (
        <p className="text-muted-foreground">
          No brews found for {brewery?.name}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrews.map((brew) => (
            <Link
              to={`/brew/${brew.id}`}
              key={brew.id}
              className="block hover:shadow-md transition overflow-hidden rounded"
            >
              <Card>
                {brew.recipe_snapshot.imageUrl && (
                  <img
                    src={brew.recipe_snapshot.imageUrl}
                    alt={brew.recipe_snapshot.name}
                    className="h-48 w-full object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-xl">
                    {brew.recipe_snapshot.name}
                  </CardTitle>
                  {brew.recipe_snapshot.style && (
                    <p className="text-sm text-muted-foreground">
                      {brew.recipe_snapshot.style}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {brew.recipe_snapshot.description && (
                    <p className="text-sm line-clamp-3">
                      {brew.recipe_snapshot.description}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <div>
                      Status: <strong>{brew.status.replace("_", " ")}</strong>
                    </div>
                    <div>
                      Created: {new Date(brew.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      ABV: {brew.abv ?? brew.recipe_snapshot.targetABV ?? "-"}
                    </div>
                    <div>Notes: {brew.notes || "-"}</div>
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

export default BreweryBrewsPage;
