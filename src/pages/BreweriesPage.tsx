import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Brewery = {
  id: string;
  name: string;
  location?: string;
  description?: string;
  image_url?: string;
};

const BreweriesPage = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [search, setSearch] = useState("");

  const [userBreweryStatuses, setUserBreweryStatuses] = useState<
    Record<string, "approved" | "pending">
  >({});

  const [selectedBrewery, setSelectedBrewery] = useState<Brewery | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/breweries")
      .then((res) => res.json())
      .then((data) => setBreweries(data))
      .catch((error) => console.error("Error fetching breweries:", error));
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:3000/breweries/membered/user?user_id=${user.id}`)
      .then((res) => res.json())
      .then(
        (
          data: {
            id: string;
            name: string;
            status: "approved" | "pending";
            role: string;
          }[]
        ) => {
          const map: Record<string, "approved" | "pending"> = {};
          data.forEach((b) => {
            map[b.id] = b.status;
          });
          setUserBreweryStatuses(map);
        }
      )
      .catch((error) => console.error("Error fetching user breweries:", error));
  }, [user?.id]);

  const handleSubmitJoinRequest = async () => {
    if (!user?.id || !selectedBrewery) return;

    try {
      const token = await getToken({ template: "supabase" });

      const res = await fetch(`http://localhost:3000/breweries/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brewery_id: selectedBrewery.id,
          message: joinMessage,
          status: "pending",
        }),
      });

      if (res.ok) {
        setUserBreweryStatuses((prev) => ({
          ...prev,
          [selectedBrewery.id]: "pending",
        }));
        setDialogOpen(false);
        setJoinMessage("");
      } else {
        console.error("Failed to send join request");
      }
    } catch (err) {
      console.error("Error sending join request:", err);
    }
  };

  const filtered = breweries.filter((brewery) =>
    brewery.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header + Search + Build Button */}
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
          {filtered.map((brewery) => {
            const status = userBreweryStatuses[brewery.id];

            return (
              <Card
                key={brewery.id}
                className="flex flex-col justify-between overflow-hidden"
              >
                <Link to={`/community/breweries/${brewery.id}`}>
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
                    <p className="text-sm line-clamp-3">
                      {brewery.description}
                    </p>
                  </CardContent>
                </Link>

                <CardContent>
                  {status === "approved" ? (
                    <Button variant="outline" disabled className="w-full">
                      Already a member
                    </Button>
                  ) : status === "pending" ? (
                    <Button variant="outline" disabled className="w-full">
                      Request pending
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedBrewery(brewery);
                        setDialogOpen(true);
                      }}
                    >
                      + Request To Join Brewery
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Join Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Request Message to Join {selectedBrewery?.name}
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Optional message (e.g. I love your beer!)"
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleSubmitJoinRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BreweriesPage;
