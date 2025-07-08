import { useEffect, useState } from "react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL;

type JoinRequest = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_image?: string;
  request_message?: string;
};

export const JoinRequestManager: React.FC = () => {
  const { brewery } = useActiveBrewery();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    if (!brewery?.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/breweries/join-requests?brewery_id=${brewery.id}`
      );
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch join requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setRefreshing(true);
    try {
      await fetch(`${API_URL}/breweries/join-requests/${id}/approve`, {
        method: "POST",
      });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to approve request", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleReject = async (id: string) => {
    setRefreshing(true);
    try {
      await fetch(`${API_URL}/breweries/join-requests/${id}`, {
        method: "DELETE",
      });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to reject request", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [brewery?.id]);

  if (!brewery?.id) {
    return (
      <div className="px-4 text-sm text-muted-foreground">
        No active brewery selected.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 px-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4">
      <h2 className="text-2xl font-bold">Pending Join Requests</h2>
      {requests.length === 0 ? (
        <p className="text-muted-foreground">No pending requests.</p>
      ) : (
        requests.map((req) => (
          <Card key={req.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={req.user_image} />
                <AvatarFallback>{req.user_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{req.user_name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {req.user_email}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm italic text-muted-foreground">
                “{req.request_message || "No message provided."}”
              </p>
              {!refreshing && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(req.id)}
                    disabled={refreshing}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(req.id)}
                    disabled={refreshing}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
