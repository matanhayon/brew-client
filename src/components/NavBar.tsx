import * as React from "react";
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
    href: "/brew/equipment",
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

export function NavBar() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Browse Recipes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {brewTools.map(({ title, href, description }) => (
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
            <ul className="grid w-[300px] gap-2 md:w-[400px]">
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
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {communityItems.map(({ title, href, description }) => (
                <ListItem key={title} title={title} href={href}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
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
        {/* Use plain anchor for Vite/react-router users can swap to <Link> */}
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
