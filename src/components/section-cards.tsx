import {
  IconTrendingUp,
  IconUsers,
  IconBeer,
  IconChefHat,
  IconPlugConnected,
  IconPlugConnectedX,
  IconBook,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";

import { fetchRecipes } from "@/api/recipes";
import { fetchSensorStatus, fetchMembers, fetchBrews } from "@/api/breweries";

export function SectionCards() {
  const [totalRecipes, setTotalRecipes] = useState<number | null | string>(
    null
  );
  const [totalMembers, setTotalMembers] = useState<number | null | string>(
    null
  );
  const [totalBrews, setTotalBrews] = useState<number | null | string>(null);
  const [deviceTemp, setDeviceTemp] = useState<number | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<"connected" | "offline">(
    "offline"
  );

  const { brewery } = useActiveBrewery();

  useEffect(() => {
    if (!brewery?.id) return;

    fetchRecipes(brewery.id)
      .then((data) => setTotalRecipes(data.length))
      .catch((err) => {
        console.error(err);
        setTotalRecipes("Error");
      });

    fetchMembers(brewery.id)
      .then((count) => setTotalMembers(count))
      .catch((err) => {
        console.error(err);
        setTotalMembers("Error");
      });

    fetchBrews(brewery.id)
      .then((data) => setTotalBrews(data.length))
      .catch((err) => {
        console.error(err);
        setTotalBrews("Error");
      });

    fetchSensorStatus(brewery.id)
      .then((data) => {
        setDeviceTemp(data.temperatureCelsius ?? null);
        setDeviceStatus(data.status === "connected" ? "connected" : "offline");
      })
      .catch((err) => {
        console.error(err);
        setDeviceTemp(null);
        setDeviceStatus("offline");
      });
  }, [brewery?.id]);

  return (
    <div className="px-4 lg:px-6 @xl/main:px-8">
      {/* Brewery Dashboard Title */}
      <h2 className="mb-6 text-3xl font-bold text-primary">
        {brewery?.name ? `${brewery.name} Dashboard` : "Brewery Dashboard"}
      </h2>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-2 @5xl/main:grid-cols-4">
        {/* Cards here */} {/* Total Recipes */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Recipes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalRecipes ?? "—"}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconChefHat className="size-4" />
                By brewery users
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Growing recipe library <IconBook className="size-4" />
            </div>
            {brewery?.name && (
              <div className="text-muted-foreground">
                Shared by {brewery?.name} members
              </div>
            )}
          </CardFooter>
        </Card>
        {/* Total Brews */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Brews</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalBrews ?? "—"}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconBeer className="size-4" />
                Liquid gold
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Hops, hops, hooray!
            </div>
            <div className="text-muted-foreground">Cheers to many more!</div>
          </CardFooter>
        </Card>
        {/* Total Members */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Members</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalMembers ?? "—"}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconUsers className="size-4" />
                Hop squad
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Community growth <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Cheers to everyone joining in!
            </div>
          </CardFooter>
        </Card>
        {/* Embedded Sensor Device */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Sensor Temperature</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {deviceTemp !== null ? `${deviceTemp.toFixed(1)}°C` : "—"}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  deviceStatus === "connected"
                    ? "text-green-600 border-green-600"
                    : "text-red-500 border-red-500"
                }
              >
                {deviceStatus === "connected" ? (
                  <>
                    <IconPlugConnected className="size-4" />
                    Online
                  </>
                ) : (
                  <>
                    <IconPlugConnectedX className="size-4" />
                    Offline
                  </>
                )}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Status: {deviceStatus === "connected" ? "Connected" : "Offline"}
            </div>
            <div className="text-muted-foreground">Brewing sensor data</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
