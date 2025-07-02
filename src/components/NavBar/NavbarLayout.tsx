import { DesktopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";

export function NavbarLayout() {
  return (
    <>
      {/* Desktop Navbar: Hidden on mobile, visible on md and up */}
      <div className="hidden md:block">
        <DesktopNavbar />
      </div>

      {/* Mobile Navbar: Visible on mobile, hidden on md and up */}
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
    </>
  );
}
