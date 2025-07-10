import React, { useEffect, useState } from "react";
import { type Device } from "@/api/types";
import { getDevicesByBrewery, createDevice } from "../api/devices";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DeviceManager: React.FC = () => {
  const { brewery: activeBrewery } = useActiveBrewery();

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newDeviceName, setNewDeviceName] = useState("");

  // For secret key reveal toggles (by device ID)
  const [revealSecrets, setRevealSecrets] = useState<Record<number, boolean>>(
    {}
  );

  const [activeTab, setActiveTab] = useState("manage");

  useEffect(() => {
    if (activeBrewery?.id) {
      loadDevices();
    }
  }, [activeBrewery]);

  const loadDevices = async () => {
    if (!activeBrewery?.id) {
      setError("No active brewery selected");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await getDevicesByBrewery(Number(activeBrewery.id));
      if (res?.data && Array.isArray(res.data)) {
        setDevices(res.data);
      } else {
        setError("No devices found or invalid response");
      }
    } catch (err) {
      setError(
        "Failed to load devices. Error: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async () => {
    if (!newDeviceName.trim() || !activeBrewery?.id) {
      alert(
        "Please enter a valid device name and ensure a brewery is selected"
      );
      return;
    }
    try {
      const res = await createDevice({
        name: newDeviceName.trim(),
        brewery_id: Number(activeBrewery.id),
      });
      if (res?.data) {
        setDevices((prev) => [...prev, res.data]);
        setNewDeviceName("");
        setActiveTab("manage"); // Switch back to manage tab after creation
      } else {
        alert("Failed to create device: invalid response");
      }
    } catch {
      alert("Failed to create device.");
    }
  };

  const toggleReveal = (id: number) => {
    setRevealSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!activeBrewery) {
    return (
      <div className="max-w-4xl mx-auto p-6 rounded-lg border border-muted-foreground bg-background">
        <h1 className="text-3xl font-bold mb-4 text-foreground">
          Manage Brewing Devices
        </h1>
        <Alert variant="destructive">
          <AlertTitle>No active brewery selected</AlertTitle>
          <AlertDescription>
            Please select a brewery to manage devices.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-lg border border-muted-foreground bg-background space-y-8 shadow-md">
      <h1 className="text-4xl font-extrabold text-foreground tracking-wide">
        Manage Brewing Devices
      </h1>

      <div className="flex justify-center">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6 w-full max-w-2xl"
        >
          <TabsList className="rounded-md border border-border bg-muted p-1 mx-auto max-w-fit">
            <TabsTrigger
              value="manage"
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold px-6 py-2 transition-colors"
            >
              Brewery Devices
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold px-6 py-2 transition-colors"
            >
              Create New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            {!loading && error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && devices.length === 0 && (
              <p className="text-center text-muted-foreground italic mt-6">
                No devices found. Try creating one!
              </p>
            )}

            {loading && (
              <p className="text-muted-foreground italic">Loading devices...</p>
            )}

            {devices.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {devices.map((device) => (
                  <Card
                    key={device.id}
                    className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {device.name || "Unnamed Device"}
                      </CardTitle>
                      <CardDescription className="font-mono text-sm select-all mt-1">
                        {revealSecrets[device.id]
                          ? device.secret_key
                          : device.secret_key?.replace(/./g, "•") || "N/A"}
                        <Button
                          variant="link"
                          size="sm"
                          className="ml-3"
                          onClick={() => toggleReveal(device.id)}
                          aria-label={
                            revealSecrets[device.id]
                              ? "Hide secret key"
                              : "Show secret key"
                          }
                        >
                          {revealSecrets[device.id] ? "Hide" : "Show"}
                        </Button>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Add extra device info if needed */}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <div className="max-w-md mx-auto space-y-5">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Create New Device Token
              </h2>
              <Input
                type="text"
                placeholder="Device Name"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                className="bg-background text-foreground"
                autoFocus
              />
              <Button
                onClick={handleCreateDevice}
                disabled={!newDeviceName.trim()}
                className="w-full"
              >
                Create Device
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeviceManager;
