import { type PropsWithChildren } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-0 md:gap-6 md:py-0">
                {children}
              </div>
            </div>
          </div>
          <footer className="border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto px-4 text-center text-gray-400">
              Made with 💛 for brewers, by brewers. 🍺
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
