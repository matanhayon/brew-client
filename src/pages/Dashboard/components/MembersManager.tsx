import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_URL;

type Member = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_image?: string;
  role: string;
  status: string;
};

export const MembersManager: React.FC = () => {
  const { user } = useUser();
  const currentUserId = user?.id;

  const { brewery } = useActiveBrewery();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = brewery?.role === "admin";

  const fetchMembers = async () => {
    if (!brewery?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/breweries/${brewery.id}`);
      const data = await res.json();
      setMembers(data.brewery_members || []);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!isAdmin) return;
    setRefreshing(true);
    try {
      await fetch(`${API_URL}/breweries/members/${memberId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      await fetchMembers();
    } catch (err) {
      console.error("Failed to change role", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleKick = async (memberId: string, isSelf: boolean = false) => {
    const confirmMsg = isSelf
      ? "Are you sure you want to leave this brewery?"
      : "Are you sure you want to remove this member?";
    if (!confirm(confirmMsg)) return;

    if (!isAdmin && !isSelf) return;

    setRefreshing(true);
    try {
      await fetch(`${API_URL}/breweries/members/${memberId}`, {
        method: "DELETE",
      });
      await fetchMembers();
    } catch (err) {
      console.error("Failed to remove member", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
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
      <h2 className="text-2xl font-bold">Members</h2>
      {members.length === 0 ? (
        <p className="text-muted-foreground">No members found.</p>
      ) : (
        members.map((member) => {
          const isSelf = member.user_id === currentUserId;

          return (
            <Card key={member.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.user_image} />
                  <AvatarFallback>{member.user_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.user_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {member.user_email}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Role:</span>
                  {isAdmin ? (
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleRoleChange(member.id, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="brewer">Brewer</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm font-medium capitalize">
                      {member.role}
                    </span>
                  )}
                </div>

                {/* Action Button: Leave or Remove */}
                {!isAdmin && isSelf ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleKick(member.id, true)}
                    disabled={refreshing}
                  >
                    Leave
                  </Button>
                ) : isAdmin && !isSelf ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleKick(member.id)}
                    disabled={refreshing}
                  >
                    Remove
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};
