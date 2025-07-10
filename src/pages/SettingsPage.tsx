import React, { useEffect, useState } from "react";
import { type Device } from "@/api/types";
import {
  getDevicesByBrewery,
  createDevice,
  removeDevice,
} from "../api/devices";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "recharts";

const DeviceManager: React.FC = () => {
  const { brewery: activeBrewery } = useActiveBrewery();

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newDeviceName, setNewDeviceName] = useState("");
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
        setActiveTab("manage");
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

  const handleDeleteDevice = async (id: number) => {
    if (!confirm("Are you sure you want to delete this device?")) return;

    try {
      await removeDevice(id);
      setDevices((prev) => prev.filter((device) => device.id !== id));
    } catch {
      alert("Failed to delete device.");
    }
  };

  if (!activeBrewery) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4 lg:px-0">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-12 text-foreground">
              Manage Brewing Devices
            </h1>
            <Alert variant="destructive">
              <AlertTitle>No active brewery selected</AlertTitle>
              <AlertDescription>
                Please select a brewery to manage devices.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 lg:px-0">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-wide text-foreground">
            Manage Brewing Devices
          </h1>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="rounded-md border border-border bg-muted p-1 max-w-fit mx-auto">
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
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading && (
                <p className="text-muted-foreground italic">
                  Loading devices...
                </p>
              )}

              {!loading && !error && devices.length === 0 && (
                <p className="text-center text-muted-foreground italic mt-6">
                  No devices found. Try creating one!
                </p>
              )}

              {devices.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full table-auto text-left border-collapse">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="py-3 px-4 border-b border-border font-semibold text-lg">
                          Device Name
                        </th>
                        <th className="py-3 px-4 border-b border-border font-semibold text-lg">
                          Secret Token
                        </th>
                        <th className="py-3 px-4 border-b border-border font-semibold text-lg">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device) => (
                        <tr
                          key={device.id}
                          className="hover:bg-muted transition-colors"
                        >
                          <td className="py-4 px-4 border-b border-border truncate max-w-xs">
                            {device.name || "Unnamed Device"}
                          </td>
                          <td className="py-4 px-4 border-b border-border font-mono select-all">
                            {revealSecrets[device.id]
                              ? device.secret_key
                              : device.secret_key?.replace(/./g, "•") || "N/A"}
                          </td>
                          <td className="py-4 px-4 border-b border-border flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleReveal(device.id)}
                              aria-label={
                                revealSecrets[device.id]
                                  ? "Hide secret token"
                                  : "Show secret token"
                              }
                            >
                              {revealSecrets[device.id]
                                ? "Hide Secret Token"
                                : "Show Secret Token"}
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDevice(device.id)}
                              aria-label="Delete device"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateDevice();
                }}
                className="max-w-md mx-auto space-y-5"
              >
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Create New Device Token
                </h2>
                <div>
                  <Label>Device Name</Label>
                  <Input
                    id="device-name"
                    type="text"
                    placeholder="Device Name"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="bg-background text-foreground"
                    autoFocus
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!newDeviceName.trim()}
                  className="w-full"
                >
                  Create Device
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManager;
