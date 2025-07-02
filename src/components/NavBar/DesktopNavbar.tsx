import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { browseRecipes, brewTools, communityItems } from "./navbar-data";

export function DesktopNavbar() {
  return (
    <NavigationMenu viewport={false} className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/dashboard" className="p-2 font-medium">
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>

        {[
          { label: "Browse Recipes", items: browseRecipes },
          { label: "Brew", items: brewTools },
          { label: "Community", items: communityItems },
        ].map(({ label, items }) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[500px] gap-2 md:grid-cols-2">
                {items.map(({ title, href, description }) => (
                  <ListItem key={title} title={title} href={href}>
                    {description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem className="ml-auto flex items-center">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 text-sm font-medium border rounded hover:bg-gray-100">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block p-2 rounded hover:bg-gray-100 no-underline"
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
