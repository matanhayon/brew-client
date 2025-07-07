import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { MembersManager } from "./MembersManager";
import { JoinRequestManager } from "./JoinRequestManager";

export const BreweryUserManager: React.FC = () => {
  const [tab, setTab] = useState("members");

  return (
    <div className="px-4">
      <h2 className="mb-4 text-2xl font-bold">Manage Brewery Users</h2>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="joinRequests">Join Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersManager />
        </TabsContent>

        <TabsContent value="joinRequests">
          <JoinRequestManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
