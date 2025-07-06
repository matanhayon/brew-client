import { useEffect, useState } from "react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Brewery = {
  id: string;
  name: string;
};

export default function BrewerySwitcher() {
  const { brewery, setActiveBrewery } = useActiveBrewery();
  const [breweries, setBreweries] = useState<Brewery[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/breweries")
      .then((res) => res.json())
      .then((data) => setBreweries(data));
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">
        {/* You can just show current brewery name or a generic icon/text */}
        {brewery ? brewery.name : "Choose Brewery"}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60">
        {breweries.map((b) => (
          <DropdownMenuItem
            key={b.id}
            onClick={() => setActiveBrewery(b.id, b.name)}
            className={brewery?.id === b.id ? "font-bold" : ""}
          >
            {b.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
