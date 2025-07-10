import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { BeerRecipe } from "@/api/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";

import { getRecipeById, startBrew } from "@/api/brew";
import { getDevicesByBrewery } from "@/api/devices";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { RecipeHeader } from "@/components/Racipe/RecipeHeader";
import { RecipeMeta } from "@/components/Racipe/RecipeMeta";
import { RecipeSteps } from "@/components/Racipe/RecipeSteps";
import { RecipeNotes } from "@/components/Racipe/RecipeNotes";
import { RecipeFooter } from "@/components/Racipe/RecipeFooter";
import { IconDroplet, IconGrain, IconPlant } from "@tabler/icons-react";

type Device = {
  id: number;
  name: string;
  secret_key: string;
};

const BrewSetupPage = () => {
  const { recipe_id } = useParams<{ recipe_id: string }>();
  const [recipe, setRecipe] = useState<BeerRecipe | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedSecretKey, setSelectedSecretKey] = useState<string | null>(
    null
  );
  const [userId] = useState("user-123"); // TODO: Replace with real user logic
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  const navigate = useNavigate();
  const { brewery } = useActiveBrewery();

  useEffect(() => {
    if (!recipe_id) return;
    getRecipeById(recipe_id)
      .then(setRecipe)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        )
      );
  }, [recipe_id]);

  useEffect(() => {
    if (!brewery) return;
    getDevicesByBrewery(Number(brewery.id))
      .then((res) => setDevices(res.data))
      .catch((err) => {
        console.error("Failed to load devices", err);
        setDevices([]);
      });
  }, [brewery]);

  const handleStartBrew = async () => {
    if (!recipe || !brewery || !selectedSecretKey) {
      setError("Please select a device before starting the brew.");
      return;
    }

    setStarting(true);
    setError("");

    try {
      const brew = await startBrew({
        recipe_id: recipe.id,
        recipe_snapshot: recipe,
        brewery_id: brewery.id,
        user_id: userId,
        notes,
        secret_key: selectedSecretKey,
      });
      navigate(`/brew/${brew.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setStarting(false);
    }
  };

  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!recipe) return <p className="p-6 italic">Loading recipe...</p>;
  if (!brewery)
    return <p className="text-red-500 p-6">No active brewery selected.</p>;

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      {/* Recipe Header */}
      <RecipeHeader id={recipe.id} name={recipe.name} style={recipe.style} />

      {recipe.imageUrl?.trim() && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name ?? "Recipe image"}
          className="w-full max-w-3xl rounded-lg shadow mb-8 object-cover mx-auto"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
        />
      )}

      {recipe.description && (
        <p className="mb-10 text-base sm:text-lg leading-relaxed">
          {recipe.description}
        </p>
      )}

      <RecipeMeta recipe={recipe} />

      {/* Ingredients Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6">Ingredients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconGrain className="size-5 text-primary" />
                Grains
              </CardTitle>
              <CardDescription>
                {(recipe.grains?.length ?? 0) > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                    {recipe.grains.map((grain, index) => (
                      <li key={index}>
                        <span className="font-medium text-foreground">
                          {grain.amount}
                        </span>{" "}
                        kg – {grain.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-muted-foreground text-sm">
                    No grains listed.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Hops */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPlant className="size-5 text-green-700" />
                Hops
              </CardTitle>
              <CardDescription>
                {(recipe.hops?.length ?? 0) > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                    {recipe.hops.map((hop, index) => (
                      <li key={index}>
                        <span className="font-medium text-foreground">
                          {hop.amount}
                        </span>{" "}
                        g – {hop.name} ({hop.time} min)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-muted-foreground text-sm">
                    No hops listed.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Yeasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconDroplet className="size-5 text-yellow-500" />
                Yeasts
              </CardTitle>
              <CardDescription>
                {(recipe.yeasts?.length ?? 0) > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                    {recipe.yeasts.map((yeast, index) => (
                      <li key={index}>{yeast.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-muted-foreground text-sm">
                    No yeasts listed.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Brew Steps & Meta */}
      <RecipeSteps
        mashTempC={recipe.mashTempC}
        mashTimeMin={recipe.mashTimeMin}
        boilTimeMin={recipe.boilTimeMin}
        originalGravity={recipe.originalGravity}
        finalGravity={recipe.finalGravity}
      />

      {recipe.notes && <RecipeNotes notes={recipe.notes} />}
      <RecipeFooter brewedCount={recipe.brewedCount} />

      {/* Device selection */}
      <Card className="mb-8 mt-12">
        <CardHeader>
          <CardTitle>Available Devices</CardTitle>
          <CardDescription className="mt-4 text-sm text-muted-foreground space-y-2">
            {devices.length === 0 ? (
              <p>No devices registered for this brewery.</p>
            ) : (
              <div className="space-y-2">
                <p>Select a device to associate with this brew:</p>
                <Select onValueChange={(val) => setSelectedSecretKey(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device.id} value={device.secret_key}>
                        {device.name} –{" "}
                        <span className="text-xs font-mono text-muted-foreground">
                          {device.secret_key}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Notes + Start Button */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Optional Notes</label>
          <Textarea
            rows={4}
            placeholder="Anything you want to note before starting this brew?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button
          onClick={handleStartBrew}
          disabled={starting || !selectedSecretKey}
          className="w-full"
        >
          {starting ? "Starting..." : "Start Brewing"}
        </Button>
      </div>
    </div>
  );
};

export default BrewSetupPage;
