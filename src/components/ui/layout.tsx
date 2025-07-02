import { type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  const showHeader = !location.pathname.startsWith("/dashboard");

  return (
    <div className="bg-gradient-to-br from-background to-muted">
      {showHeader && <Header />}
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto px-4 text-center text-gray-400">
          Made with 💛 for brewers, by brewers. 🍺
        </div>
      </footer>
    </div>
  );
};

export default Layout;
