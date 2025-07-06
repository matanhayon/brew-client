import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Brewery = {
  id: string;
  name: string;
  location?: string;
  description?: string;
  image_url?: string;
};

const BreweriesPage = () => {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/breweries")
      .then((res) => res.json())
      .then((data) => setBreweries(data))
      .catch((error) => console.error("Error fetching breweries:", error));
  }, []);

  const filtered = breweries.filter((brewery) =>
    brewery.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header + Search + Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Breweries</h1>
          <Input
            placeholder="Search breweries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>
        <Link to="/dashboard/build-brewery" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">+ Build Brewery</Button>
        </Link>
      </div>

      {/* Brewery Grid */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No breweries found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((brewery) => (
            <Link
              to={`/community/breweries/${brewery.id}`}
              key={brewery.id}
              className="block hover:shadow-md transition overflow-hidden rounded"
            >
              <Card>
                <img
                  src={brewery.image_url || "/images/default-brewery.png"}
                  alt={brewery.name}
                  className="h-48 w-full object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-xl">{brewery.name}</CardTitle>
                  {brewery.location && (
                    <p className="text-sm text-muted-foreground">
                      {brewery.location}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{brewery.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BreweriesPage;
