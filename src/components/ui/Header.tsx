import { useTheme } from "@/context/theme-provider";
import { Link } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { MobileNavBar } from "../MobileNavBar";
import { DesktopNavBar } from "../DesktopNavBar";

const Header = () => {
  const { theme } = useTheme();
  console.log(theme);
  return (
    <header className="sticky z-1 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link to={"/"}>
          <img
            src={
              theme === "dark" ? "/dark-mode-logo.png" : "light-mode-logo.png"
            }
            alt="logo"
            className="h-18"
          />
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:block">
          <DesktopNavBar />
        </div>

        {/* Right: Mobile Nav + Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <MobileNavBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
