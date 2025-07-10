import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getBrewById, getBrewTempLogs } from "@/api/brew";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type BrewStatus = "pending" | "in_progress" | "completed";

type HopAddition = {
  name: string;
  time: string;
  amount: string;
};

type RecipeSnapshot = {
  id: number;
  name: string;
  style?: string;
  imageUrl?: string;
  description?: string;
  targetABV?: number;
  targetIBU?: number;
  mashTempC?: number;
  mashTimeMin?: number;
  boilTimeMin?: number;
  hops?: HopAddition[];
};

type Brew = {
  id: number | string;
  created_at: string;
  brewery_id: number;
  user_id: string;
  recipe_id: number;
  recipe_snapshot: RecipeSnapshot;
  ended_at?: string | null;
  status: BrewStatus;
  notes?: string;
  original_gravity?: number;
  final_gravity?: number;
  abv?: number;
  secret_key?: string;
};

type BrewTempLog = {
  id: number;
  created_at: string;
  brew_id: number;
  brewery_id: number;
  user_id: string;
  recorded_at: string;
  temperature_celsius: number;
};

const BrewPage = () => {
  const { brewId } = useParams<{ brewId: string }>();
  const { isLoaded } = useUser();

  const [brew, setBrew] = useState<Brew | null>(null);
  const [tempLogs, setTempLogs] = useState<BrewTempLog[]>([]);
  const [loadingBrew, setLoadingBrew] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brewId || !isLoaded) return;

    const fetchBrew = () => {
      getBrewById(brewId)
        .then((data) => {
          setBrew(data);
          setLoadingBrew(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoadingBrew(false);
        });
    };

    setLoadingBrew(true);
    fetchBrew();

    const interval = setInterval(fetchBrew, 10000);
    return () => clearInterval(interval);
  }, [brewId, isLoaded]);

  useEffect(() => {
    if (!brew || brew.status !== "in_progress") return;

    const fetchLogs = () => {
      setLoadingLogs(true);
      getBrewTempLogs(brew.id)
        .then((logs) => {
          setTempLogs(logs);
          setLoadingLogs(false);
        })
        .catch(() => setLoadingLogs(false));
    };

    fetchLogs();

    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [brew]);

  if (loadingBrew)
    return (
      <div className="py-20 flex justify-center">
        <Progress className="w-24" />
      </div>
    );

  if (error)
    return (
      <div className="py-20 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error loading brew</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );

  if (!brew)
    return (
      <div className="py-20 px-4">
        <p>No brew found.</p>
      </div>
    );

  const badgeBg = {
    pending: "bg-orange-100",
    in_progress: "bg-blue-100",
    completed: "bg-green-100",
  };
  const badgeText = {
    pending: "text-orange-800",
    in_progress: "text-blue-800",
    completed: "text-green-800",
  };

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">{brew.recipe_snapshot.name}</h2>

      <Card>
        <CardHeader>
          <CardTitle>Brew Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <span>Status:</span>
            <Badge
              variant="outline"
              className={`${badgeBg[brew.status]} ${badgeText[brew.status]}`}
            >
              {brew.status.replace("_", " ")}
            </Badge>
          </div>
          <p>
            <strong>Started:</strong>{" "}
            {new Date(brew.created_at).toLocaleString()}
          </p>
          {brew.ended_at && (
            <p>
              <strong>Ended:</strong> {new Date(brew.ended_at).toLocaleString()}
            </p>
          )}
          {brew.notes && (
            <p>
              <strong>Notes:</strong> {brew.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brewing Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mash Step */}
          <div>
            <h4 className="font-semibold text-lg mb-1">Mash</h4>
            <p>
              Mash at <strong>{brew.recipe_snapshot.mashTempC ?? "-"}°C</strong>{" "}
              for{" "}
              <strong>{brew.recipe_snapshot.mashTimeMin ?? "-"} minutes</strong>
              .
            </p>
          </div>

          {/* Boil Step */}
          <div>
            <h4 className="font-semibold text-lg mb-1">Boil</h4>
            <p>
              Boil for{" "}
              <strong>{brew.recipe_snapshot.boilTimeMin ?? "-"} minutes</strong>
              .
            </p>

            {/* Hops schedule */}
            {brew.recipe_snapshot.hops &&
              brew.recipe_snapshot.hops.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Hop Additions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {brew.recipe_snapshot.hops
                      .sort((a, b) => {
                        const timeA = parseInt(a.time || "0");
                        const timeB = parseInt(b.time || "0");
                        return timeB - timeA;
                      })
                      .map((hop, index) => (
                        <li key={index}>
                          <strong>{hop.name}</strong> – {hop.amount}g{" "}
                          {hop.time
                            ? `@ ${hop.time} min`
                            : "(dry hop or flameout)"}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {brew.status === "pending" && (
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Pending Brew</AlertTitle>
          <AlertDescription>
            Trying to connect to brewing controller...
            <br />
            <strong>Secret Key:</strong> {brew.secret_key ?? "N/A"}
          </AlertDescription>
        </Alert>
      )}

      {brew.status === "in_progress" && (
        <Card>
          <CardHeader>
            <CardTitle>Brewing Process</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <div className="flex justify-center">
                <Progress className="w-24" />
              </div>
            ) : tempLogs.length === 0 ? (
              <p>No temperature logs available yet.</p>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Last updated:{" "}
                  {new Date(
                    tempLogs[tempLogs.length - 1].recorded_at
                  ).toLocaleString()}
                </p>
                <p className="text-4xl font-bold">
                  {tempLogs[tempLogs.length - 1].temperature_celsius.toFixed(2)}
                  °C
                </p>
                <p className="text-lg font-medium text-muted-foreground">
                  Current Temperature
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {brew.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle>Brew Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Original Gravity:</strong> {brew.original_gravity ?? "-"}
            </p>
            <p>
              <strong>Final Gravity:</strong> {brew.final_gravity ?? "-"}
            </p>
            <p>
              <strong>ABV:</strong>{" "}
              {brew.abv ?? brew.recipe_snapshot.targetABV ?? "-"}
            </p>
            <p>
              <strong>Notes:</strong> {brew.notes ?? "-"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrewPage;
