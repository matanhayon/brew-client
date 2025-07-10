import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Brew } from "../../../api/types";

type Props = {
  brew: Brew;
  formatDuration: (start?: string | null, end?: string | null) => string;
  getRemainingTime: (
    start: string | null | undefined,
    totalMinutes: number | undefined
  ) => string | null;
};

const BrewTimeline = ({ brew, formatDuration, getRemainingTime }: Props) => {
  const isMashActive =
    brew.mash_status === "started" ||
    (brew.mash_status === "ended" && brew.boil_status === "pending");
  const isBoilActive = brew.boil_status === "started";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brewing Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-gray-300 space-y-8 ml-3">
          {/* Mash Step */}
          <li className="relative flex items-start gap-4">
            <div
              className={`w-3 h-3 rounded-full mt-1 ${
                brew.mash_status === "ended"
                  ? "bg-green-500"
                  : isMashActive
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
            <div>
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
            </div>
          </li>

          {/* Boil Step */}
          <li className="relative flex items-start gap-4">
            <div
              className={`w-3 h-3 rounded-full mt-1 ${
                brew.boil_status === "ended"
                  ? "bg-green-500"
                  : isBoilActive
                  ? "bg-red-500 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
            <div>
              <h4 className="text-lg font-semibold">Boil</h4>
              <p className="text-sm text-muted-foreground">
                Target: <strong>95°C+</strong> for{" "}
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
            </div>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
};

export default BrewTimeline;
