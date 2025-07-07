import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
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

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
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
    {
      title: "Browse Recepies",
      url: "/community/recipes",
      icon: IconFolder,
    },
    {
      title: "Browse Breweries",
      url: "/community/breweries",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Build Recipe",
      url: "/dashboard/build-recipe/",
      icon: IconDatabase,
    },
    {
      name: "Build Brewery",
      url: "/dashboard/build-brewery/",
      icon: IconReport,
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 flex items-center gap-2">
                  <Beer className="!size-5" />
                  <span className="text-base font-semibold">
                    {brewery?.name ?? "Select Brewery"}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 p-2">
                <BreweryDropdownItems />
              </DropdownMenuContent>
            </DropdownMenu>
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
          <SignInButton>
            <button className="w-full text-left">Sign In</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm bg-muted">
            <UserButton />
            <span className="text-foreground font-medium">
              {user?.fullName}
            </span>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
