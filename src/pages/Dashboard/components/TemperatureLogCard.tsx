import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BrewTempLog } from "@/api/types";

const TemperatureLogCard = ({
  tempLogs,
  loading,
}: {
  tempLogs: BrewTempLog[];
  loading: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brewing Process</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
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
              {tempLogs[tempLogs.length - 1].temperature_celsius.toFixed(2)}°C
            </p>
            <p className="text-lg font-medium text-muted-foreground">
              Current Temperature
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemperatureLogCard;
