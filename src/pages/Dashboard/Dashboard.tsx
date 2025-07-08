import { useUser } from "@clerk/clerk-react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";
import { BreweryUserManager } from "./components/BreweryUserManager";

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useUser();

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Please sign in to view the dashboard.
        </h2>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading Dashboard
        </h2>
      </div>
    );
  }

  return (
    <>
      <SectionCards />
      <BreweryUserManager />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
