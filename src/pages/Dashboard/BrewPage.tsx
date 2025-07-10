import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getBrewById, getBrewTempLogs } from "@/api/brew";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type BrewStatus = "pending" | "started" | "ended";

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
  mash_status?: BrewStatus;
  boil_status?: BrewStatus;
  mash_start?: string | null;
  mash_end?: string | null;
  boil_start?: string | null;
  boil_end?: string | null;
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
  const [now, setNow] = useState<Date>(new Date());

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (start?: string | null, end?: string | null) => {
    if (!start) return "-";
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const durationMin = Math.round(
      (endDate.getTime() - startDate.getTime()) / 60000
    );
    return `${durationMin} min`;
  };

  const getRemainingTime = (
    start: string | null | undefined,
    totalMinutes: number | undefined
  ): string | null => {
    if (!start || !totalMinutes) return null;
    const startTime = new Date(start);
    const endTime = new Date(startTime.getTime() + totalMinutes * 60000);
    const diffMs = endTime.getTime() - now.getTime();
    if (diffMs <= 0) return "Completed";
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s remaining`;
  };

  useEffect(() => {
    if (!brewId || !isLoaded) return;
    const fetchBrew = () => {
      setLoadingBrew(true);
      getBrewById(brewId)
        .then(setBrew)
        .catch((err) => setError(err.message))
        .finally(() => setLoadingBrew(false));
    };
    fetchBrew();
    const interval = setInterval(fetchBrew, 10000);
    return () => clearInterval(interval);
  }, [brewId, isLoaded]);

  useEffect(() => {
    if (!brew || brew.status !== "started") return;
    const fetchLogs = () => {
      setLoadingLogs(true);
      getBrewTempLogs(brew.id)
        .then(setTempLogs)
        .finally(() => setLoadingLogs(false));
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [brew]);

  const badgeStyles = {
    pending: "bg-orange-100 text-orange-800",
    started: "bg-blue-100 text-blue-800",
    ended: "bg-green-100 text-green-800",
  };

  if (loadingBrew) {
    return (
      <div className="py-20 flex justify-center">
        <Progress className="w-24" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error loading brew</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!brew) {
    return (
      <div className="py-20 px-4">
        <p>No brew found.</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">{brew.recipe_snapshot.name}</h2>

      {/* Brew Info */}
      <Card>
        <CardHeader>
          <CardTitle>Brew Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <span>Status:</span>
            <Badge variant="outline" className={badgeStyles[brew.status]}>
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

      {/* Pending Brew */}
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

      {/* Active Brew */}
      {brew.status === "started" && (
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

      {/* Ended Brew */}
      {brew.status === "ended" && (
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

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Brewing Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-gray-300 space-y-8">
            {/* Mash Step */}
            <li className="ml-4">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1" />
              <h4 className="text-lg font-semibold">Mash</h4>
              <p className="text-sm text-muted-foreground">
                Target:{" "}
                <strong>{brew.recipe_snapshot.mashTempC ?? "-"}°C</strong> for{" "}
                <strong>{brew.recipe_snapshot.mashTimeMin ?? "-"} min</strong>
              </p>
              <div className="text-sm mt-1 text-gray-500">
                {brew.mash_status === "pending" && <p>Status: Not started</p>}
                {brew.mash_status === "started" && brew.mash_start && (
                  <>
                    <p>Started: {new Date(brew.mash_start).toLocaleString()}</p>
                    <p>
                      {getRemainingTime(
                        brew.mash_start,
                        brew.recipe_snapshot.mashTimeMin
                      )}
                    </p>
                  </>
                )}
                {brew.mash_status === "ended" &&
                  brew.mash_start &&
                  brew.mash_end && (
                    <p>
                      Completed: {new Date(brew.mash_end).toLocaleString()} (
                      {formatDuration(brew.mash_start, brew.mash_end)})
                    </p>
                  )}
              </div>
            </li>

            {/* Boil Step */}
            <li className="ml-4">
              <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-1.5 top-1" />
              <h4 className="text-lg font-semibold">Boil</h4>
              <p className="text-sm text-muted-foreground">
                Duration:{" "}
                <strong>{brew.recipe_snapshot.boilTimeMin ?? "-"} min</strong>
              </p>
              <div className="text-sm mt-1 text-gray-500">
                {brew.boil_status === "pending" && <p>Status: Not started</p>}
                {brew.boil_status === "started" && brew.boil_start && (
                  <>
                    <p>Started: {new Date(brew.boil_start).toLocaleString()}</p>
                    <p>
                      {getRemainingTime(
                        brew.boil_start,
                        brew.recipe_snapshot.boilTimeMin
                      )}
                    </p>
                  </>
                )}
                {brew.boil_status === "ended" &&
                  brew.boil_start &&
                  brew.boil_end && (
                    <p>
                      Completed: {new Date(brew.boil_end).toLocaleString()} (
                      {formatDuration(brew.boil_start, brew.boil_end)})
                    </p>
                  )}
              </div>

              {/* Hop Additions */}
              {(brew.recipe_snapshot.hops ?? []).length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Hop Additions:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {[...(brew.recipe_snapshot.hops ?? [])]
                      .sort(
                        (a, b) =>
                          parseInt(b.time ?? "0") - parseInt(a.time ?? "0")
                      )
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
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrewPage;
