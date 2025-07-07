import { useEffect, useState } from "react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

type Brewery = {
  id: string;
  name: string;
};

export default function BreweryDropdownItems() {
  const { user } = useUser();
  const { brewery, setActiveBrewery } = useActiveBrewery();
  const [breweries, setBreweries] = useState<Brewery[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    fetch(
      `http://localhost:3000/breweries/membered/user/approved?user_id=${user.id}`
    )
      .then((res) => res.json())
      .then((data) => setBreweries(data));
  }, [user?.id]);

  return (
    <>
      {breweries.map((b) => (
        <DropdownMenuItem
          key={b.id}
          onClick={() => setActiveBrewery(b.id, b.name)}
          className={brewery?.id === b.id ? "font-bold" : ""}
        >
          {b.name}
        </DropdownMenuItem>
      ))}
    </>
  );
}
