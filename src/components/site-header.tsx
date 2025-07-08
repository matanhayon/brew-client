import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import Header from "./ui/Header";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";

// function kebabToSpacedCamelCase(str: string) {
//   return str
//     .split("-")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ");
// }

export function SiteHeader() {
  // const location = useLocation();
  const { brewery } = useActiveBrewery();

  // const pathSegments = location.pathname.split("/").filter(Boolean);
  // const lastSegment = pathSegments.length
  //   ? pathSegments[pathSegments.length - 1]
  //   : "home";

  // const pageName = kebabToSpacedCamelCase(lastSegment);

  return (
    <>
      <Header />
      <header className="flex h-[var(--header-height)] justify-center shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
        <div className="flex items-center gap-2 px-6">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link
              // to={`/community/breweries/${brewery?.id}`}
              to="/dashboard"
              className="dark:text-foreground"
            >
              {brewery?.name}
            </Link>
          </Button>
        </div>
      </header>
    </>
  );
}
