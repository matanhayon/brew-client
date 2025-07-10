import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getBrewById } from "@/api/brew";

import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import BrewInfoCard from "./components/BrewInfoCard";
import TemperatureLogSection from "@/pages/Dashboard/components/TemperatureLogSection";
import EndedBrewCard from "@/pages/Dashboard/components/EndedBrewCard";
import BrewStatusSection from "@/pages/Dashboard/components/BrewStatusSection";
import BrewTimeline from "./components/BrewTimeline";

import type { Brew } from "@/api/types";

const BrewPage = () => {
  const { brewId } = useParams<{ brewId: string }>();
  const { isLoaded } = useUser();

  const [brew, setBrew] = useState<Brew | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  // Live ticking clock for countdown timers
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

  // Initial fetch + polling without flickering loading state
  useEffect(() => {
    if (!brewId || !isLoaded) return;

    const fetchBrew = async () => {
      try {
        const data = await getBrewById(brewId);
        setBrew(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load brew");
        }
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchBrew();

    const interval = setInterval(async () => {
      try {
        const data = await getBrewById(brewId);
        setBrew(data); // update silently without toggling loading or error
      } catch {
        // optionally handle polling errors silently
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [brewId, isLoaded]);

  if (loadingInitial) {
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

      <BrewInfoCard brew={brew} />
      <BrewStatusSection brew={brew} />

      {brew.status === "started" && (
        <TemperatureLogSection brewId={brew.id} brewStatus={brew.status} />
      )}

      {brew.status === "ended" && <EndedBrewCard brew={brew} />}

      <BrewTimeline
        brew={brew}
        formatDuration={formatDuration}
        getRemainingTime={getRemainingTime}
      />
    </div>
  );
};

export default BrewPage;
