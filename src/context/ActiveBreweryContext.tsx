import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/clerk-react";

export type ActiveBrewery = {
  id: string;
  name: string;
};

type ActiveBreweryContextType = {
  brewery: ActiveBrewery | null;
  setActiveBrewery: (id: string, name: string) => void;
  clearActiveBrewery: () => void;
};

const ActiveBreweryContext = createContext<
  ActiveBreweryContextType | undefined
>(undefined);

export function ActiveBreweryProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [brewery, setBrewery] = useState<ActiveBrewery | null>(null);

  const storageKey = user ? `activeBrewery_${user.id}` : null;

  // Load from localStorage when user is available
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

  const setActiveBrewery = (id: string, name: string) => {
    const newBrewery = { id, name };
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
      value={{ brewery, setActiveBrewery, clearActiveBrewery }}
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
