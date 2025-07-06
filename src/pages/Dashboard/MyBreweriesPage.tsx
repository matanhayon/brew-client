import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import DashboardLayout from "./DashboardLayout";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BrewerySwitcher from "@/components/BrewerySwitcher";

type Brewery = {
  id: string;
  user_id: string;
  name: string;
  city?: string;
  country?: string;
  description?: string;
  image_url?: string;
};

const MyBreweriesPage = () => {
  const { user, isLoaded } = useUser();
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    fetch("http://localhost:3000/breweries")
      .then((res) => res.json())
      .then((data) => setBreweries(data))
      .catch((err) => console.error("Error fetching breweries:", err));
  }, [isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const myBreweries = breweries.filter(
    (brewery) =>
      brewery.user_id === user?.id &&
      brewery.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-10">
        {/* Header + Search + Button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <BrewerySwitcher />
          <div className="flex flex-col gap-2 w-full">
            <Input
              placeholder="Search my breweries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-sm"
            />
          </div>

          <Link to="/dashboard/build-brewery" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">+ Build New Brewery</Button>
          </Link>
        </div>

        {/* Brewery Grid */}
        {myBreweries.length === 0 ? (
          <p className="text-muted-foreground">
            You haven’t created any breweries yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBreweries.map((brewery) => (
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
                    <p className="text-sm text-muted-foreground">
                      {[brewery.city, brewery.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">
                      {brewery.description}
                    </p>
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

export default MyBreweriesPage;
