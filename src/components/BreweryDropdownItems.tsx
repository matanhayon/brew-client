import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function BreweryDropdownItems() {
  const { brewery, breweries, setActiveBrewery } = useActiveBrewery();

  return (
    <>
      {breweries.map((b) => (
        <DropdownMenuItem
          key={b.id}
          onClick={() => setActiveBrewery(b.id, b.name, b.role)}
          className={brewery?.id === b.id ? "font-bold" : ""}
        >
          <div className="flex flex-col">
            <span>{b.name}</span>
            <span className="text-sm text-muted-foreground capitalize">
              {b.role}
            </span>
          </div>
        </DropdownMenuItem>
      ))}
    </>
  );
}
