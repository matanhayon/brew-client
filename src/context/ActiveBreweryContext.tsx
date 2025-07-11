import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/clerk-react";

export type Brewery = {
  id: string;
  name: string;
  role: string;
};

export type ActiveBrewery = {
  id: string;
  name: string;
  role: string;
};

type ActiveBreweryContextType = {
  brewery: ActiveBrewery | null;
  setActiveBrewery: (id: string, name: string, role: string) => void;
  clearActiveBrewery: () => void;
  breweries: Brewery[];
  refreshBreweries: () => void;
};

const ActiveBreweryContext = createContext<
  ActiveBreweryContextType | undefined
>(undefined);

export function ActiveBreweryProvider({ children }: { children: ReactNode }) {
  const refreshBreweries = () => {
    if (!user?.id) return;
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/breweries/membered/user/approved?user_id=${user.id}`
    )
      .then((res) => res.json())
      .then((data: BreweryApiResponseItem[]) => {
        const parsed: Brewery[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          status: item.status,
        }));
        setBreweries(parsed);
      })
      .catch((err) => {
        console.error("Failed to fetch breweries", err);
      });
  };

  const { user } = useUser();
  const [brewery, setBrewery] = useState<ActiveBrewery | null>(null);
  const [breweries, setBreweries] = useState<Brewery[]>([]);

  const storageKey = user ? `activeBrewery_${user.id}` : null;

  // Load active brewery from localStorage
  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setBrewery(JSON.parse(stored));
      } catch (e) {
        console.warn("Failed to parse saved brewery", e);
      }
    }
  }, [storageKey]);

  // Define the API response type
  type BreweryApiResponseItem = {
    id: string;
    name: string;
    role: string;
    status: string;
  };

  // Fetch user's breweries from backend
  useEffect(() => {
    refreshBreweries();
  }, [user?.id]);

  const setActiveBrewery = (id: string, name: string, role: string) => {
    const newBrewery = { id, name, role };
    setBrewery(newBrewery);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newBrewery));
    }
  };

  const clearActiveBrewery = () => {
    setBrewery(null);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <ActiveBreweryContext.Provider
      value={{
        brewery,
        setActiveBrewery,
        clearActiveBrewery,
        breweries,
        refreshBreweries,
      }}
    >
      {children}
    </ActiveBreweryContext.Provider>
  );
}

export function useActiveBrewery() {
  const context = useContext(ActiveBreweryContext);
  if (!context) {
    throw new Error(
      "useActiveBrewery must be used within an ActiveBreweryProvider"
    );
  }
  return context;
}
