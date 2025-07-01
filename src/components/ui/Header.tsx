import { useTheme } from "@/context/theme-provider";
import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { NavBar } from "../NavBar";

const Header = () => {
  const { theme } = useTheme();
  console.log(theme);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to={"/"}>
          <img
            src={
              theme === "dark" ? "/dark-mode-logo.png" : "light-mode-logo.png"
            }
            alt="logo"
            className="h-18"
          />
        </Link>
        <NavBar />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
