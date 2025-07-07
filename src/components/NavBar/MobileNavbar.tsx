import {
  DropdownMenu,
  // DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
// import { MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { browseRecipes, brewTools, communityItems } from "./navbar-data";
// import { SidebarTrigger } from "../ui/sidebar";

export function MobileNavbar() {
  return (
    <div className="md:hidden flex items-center justify-end px-4 py-2">
      <DropdownMenu>
        {/* <DropdownMenuTrigger asChild>
          <button className="p-2 rounded border">
            <MenuIcon className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger> */}
        {/* <SidebarTrigger className="w-10 h-10 p-4 text-2xl rounded border" /> */}

        <DropdownMenuContent align="end" className="w-56">
          {/* Dashboard link */}
          <DropdownMenuItem asChild>
            <Link to="/dashboard">Dashboard</Link>
          </DropdownMenuItem>

          {[
            { label: "Browse Recipes", items: browseRecipes },
            { label: "Brew", items: brewTools },
            { label: "Community", items: communityItems },
          ].map(({ label, items }) => (
            <DropdownMenuSub key={label}>
              <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {items.map(({ title, href }) => (
                  <DropdownMenuItem asChild key={title}>
                    <Link to={href}>{title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}

          <DropdownMenuItem asChild>
            <SignedOut>
              <SignInButton>
                <button className="w-full text-left">Sign In</button>
              </SignInButton>
            </SignedOut>
          </DropdownMenuItem>

          <SignedIn>
            <DropdownMenuItem asChild>
              <UserButton afterSignOutUrl="/" />
            </DropdownMenuItem>
          </SignedIn>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
