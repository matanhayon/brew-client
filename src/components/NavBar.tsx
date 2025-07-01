import * as React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const browseRecipes = [
  {
    title: "All Recipes",
    href: "/recipes",
    description: "Explore our full collection of brewing recipes.",
  },
  {
    title: "By Style",
    href: "/recipes/styles",
    description: "Browse recipes sorted by beer style.",
  },
  {
    title: "By Difficulty",
    href: "/recipes/difficulty",
    description: "Find recipes by beginner, intermediate, or expert level.",
  },
];

const brewTools = [
  {
    title: "Start a Brew",
    href: "/brew/start",
    description: "Begin a new brewing session step-by-step.",
  },
  {
    title: "Brew Timer",
    href: "/brew/timer",
    description: "Track your brew process with customizable timers.",
  },
  {
    title: "Equipment Setup",
    href: "/dashboard",
    description: "Guide to setting up your brewing equipment.",
  },
];

const historyItems = [
  {
    title: "My Brews",
    href: "/history/my-brews",
    description: "Review your previous brewing sessions.",
  },
  {
    title: "Tasting Notes",
    href: "/history/notes",
    description: "Record and browse tasting notes.",
  },
];

const communityItems = [
  {
    title: "Forums",
    href: "/community/forums",
    description: "Discuss brewing tips and tricks.",
  },
  {
    title: "Events",
    href: "/community/events",
    description: "Find local beer brewing events.",
  },
  {
    title: "User Recipes",
    href: "/community/recipes",
    description: "Share and discover user-submitted recipes.",
  },
];

const beerInfoItems = [
  {
    title: "Styles Guide",
    href: "/beer/styles",
    description: "Explore beer styles and characteristics.",
  },
  {
    title: "Ingredients",
    href: "/beer/ingredients",
    description: "Learn about hops, malts, yeast, and water.",
  },
  {
    title: "Techniques",
    href: "/beer/techniques",
    description: "Brewing methods, fermentation tips, and more.",
  },
];

const learningItems = [
  {
    title: "Brewing 101",
    href: "/learn/basics",
    description: "Beginner’s guide to home brewing.",
  },
  {
    title: "Advanced Techniques",
    href: "/learn/advanced",
    description: "Take your brewing to the next level.",
  },
  {
    title: "Video Tutorials",
    href: "/learn/videos",
    description: "Watch walkthroughs and brewing sessions.",
  },
];

export function NavBar() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/dashboard" className="p-2 font-medium">
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Browse Recipes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-2 md:grid-cols-2">
              {browseRecipes.map(({ title, href, description }) => (
                <ListItem key={title} title={title} href={href}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Brew</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-2 md:grid-cols-2">
              {brewTools.map(({ title, href, description }) => (
                <ListItem key={title} title={title} href={href}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Beer Info</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-2 md:grid-cols-2">
              {beerInfoItems.map(({ title, href, description }) => (
                <ListItem key={title} title={title} href={href}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-2 md:grid-cols-2">
              {learningItems.map(({ title, href, description }) => (
                <ListItem key={title} title={title} href={href}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>History</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2">
              {historyItems.map(({ title, href, description }) => (
                <ListItem key={title} title={title} href={href}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-2 md:grid-cols-2">
              {communityItems.map(({ title, href, description }) => (
                <ListItem key={title} title={title} href={href}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

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
