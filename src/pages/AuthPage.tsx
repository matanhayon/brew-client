import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SignIn, SignUp } from "@clerk/clerk-react";

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto p-1 rounded-xl bg-background shadow-md">
      <Tabs defaultValue="sign-in" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-in">
          <SignIn />
        </TabsContent>

        <TabsContent value="sign-up">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
