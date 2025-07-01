// components/MobileNavBar.tsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { MenuIcon } from "lucide-react";

const categories = [
  {
    label: "Browse Recipes",
    items: [
      { title: "All Recipes", href: "/recipes" },
      { title: "By Style", href: "/recipes/styles" },
      { title: "By Difficulty", href: "/recipes/difficulty" },
    ],
  },
  {
    label: "Brew",
    items: [
      { title: "Start a Brew", href: "/brew/start" },
      { title: "Brew Timer", href: "/brew/timer" },
      { title: "Equipment Setup", href: "/dashboard" },
    ],
  },
  {
    label: "Beer Info",
    items: [
      { title: "Styles Guide", href: "/beer/styles" },
      { title: "Ingredients", href: "/beer/ingredients" },
      { title: "Techniques", href: "/beer/techniques" },
    ],
  },
  {
    label: "Learn",
    items: [
      { title: "Brewing 101", href: "/learn/basics" },
      { title: "Advanced Techniques", href: "/learn/advanced" },
      { title: "Video Tutorials", href: "/learn/videos" },
    ],
  },
  {
    label: "History",
    items: [
      { title: "My Brews", href: "/history/my-brews" },
      { title: "Tasting Notes", href: "/history/notes" },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Forums", href: "/community/forums" },
      { title: "Events", href: "/community/events" },
      { title: "User Recipes", href: "/community/recipes" },
    ],
  },
];

export function MobileNavBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <a href="/" className="text-lg font-bold"></a>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2">
              <MenuIcon className="size-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {categories.map((cat) => (
              <DropdownMenuSub key={cat.label}>
                <DropdownMenuSubTrigger>{cat.label}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {cat.items.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <a href={item.href}>{item.title}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}

            <DropdownMenuItem asChild>
              <a href="/dashboard">Dashboard</a>
            </DropdownMenuItem>

            <SignedOut>
              <DropdownMenuItem asChild>
                <SignInButton>
                  <button>Sign In</button>
                </SignInButton>
              </DropdownMenuItem>
            </SignedOut>
            <SignedIn>
              <DropdownMenuItem asChild>
                <UserButton afterSignOutUrl="/" />
              </DropdownMenuItem>
            </SignedIn>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
