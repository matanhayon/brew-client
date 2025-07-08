import {
  SignedIn,
  SignedOut,
  // SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  // IconDatabase,
  IconFolder,
  IconHome,
  IconListDetails,
  // IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { Beer } from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
// import { NavUser } from "@/components/nav-user"; // no longer needed

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import BreweryDropdownItems from "@/components/BreweryDropdownItems";

import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import { ModeToggle } from "./mode-toggle";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "My Recipes",
      url: "/dashboard/my-recipes",
      icon: IconListDetails,
    },
    {
      title: "Brewery Recepies",
      url: "/dashboard/brewery-recipes",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Browse Recepies",
      url: "/community/recipes",
      icon: IconFolder,
    },
    {
      name: "Browse Breweries",
      url: "/community/breweries",
      icon: IconUsers,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { brewery } = useActiveBrewery();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* If user is signed in, show the brewery dropdown */}
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="flex items-center gap-2 px-4 py-6 border border-border rounded-md hover:bg-muted/50 transition-colors">
                    <Beer className="!size-5" />
                    <span className="text-base font-semibold">
                      {brewery?.name ?? "Select Brewery"}
                    </span>
                    {/* Three vertical dots icon */}
                    <div className="ml-auto text-xl">
                      <span className="text-muted-foreground">⋮</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 p-2">
                  <BreweryDropdownItems />
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

            {/* If user is signed out, show a sign-in button */}
            <SignedOut>
              <Link to="/auth">
                <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 flex items-center gap-2 text-base font-semibold">
                  <Beer className="!size-5" />
                  Sign In to Select Brewery
                </SidebarMenuButton>
              </Link>
            </SignedOut>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <SignedOut>
          <Link to="auth">
            <Button variant="outline" className="w-full border">
              Sign In
            </Button>
          </Link>
        </SignedOut>

        <SignedIn>
          <div className="flex justify-between items-center gap-3 px-4 py-2 rounded-xl shadow-sm bg-muted">
            <div className="flex items-center gap-2">
              <UserButton />
              <span className="text-foreground font-medium">
                {user?.fullName}
              </span>
            </div>

            <ModeToggle />
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
