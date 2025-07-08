import { useTheme } from "@/context/theme-provider";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";
import {
  SignedIn,
  SignedOut,
  // SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./button";

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Left: Sidebar Trigger */}
        <div className="flex items-center justify-start w-1/3">
          <SidebarTrigger className="w-10 h-10 p-2 text-2xl rounded border" />
        </div>

        {/* Center: Logo */}
        <div className="flex items-center justify-center w-1/3">
          <Link to="/">
            <img
              src={
                theme === "dark"
                  ? "/images/dark-mode-logo.png"
                  : "/images/light-mode-logo.png"
              }
              alt="logo"
              className="h-16"
            />
          </Link>
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex items-center justify-end w-1/3 space-x-2">
          <SignedOut>
            <Link to="auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "rounded-md",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
