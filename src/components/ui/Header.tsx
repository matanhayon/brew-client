import { useTheme } from "@/context/theme-provider";
import { Link } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { NavbarLayout } from "../NavBar/NavbarLayout";

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto relative flex h-20 items-center justify-between px-4">
        {/* Mobile: Navbar on the left */}
        <div className="md:hidden">
          <NavbarLayout />
        </div>

        {/* Logo: Center on mobile, left on desktop */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <img
            src={
              theme === "dark" ? "/dark-mode-logo.png" : "/light-mode-logo.png"
            }
            alt="logo"
            className="h-12"
          />
        </Link>

        {/* Desktop: Navbar in the center */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <NavbarLayout />
        </div>

        {/* Toggle: Always on the right */}
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
