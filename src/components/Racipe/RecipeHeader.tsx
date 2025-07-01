import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const RecipeHeader = ({
  id,
  name,
  style,
}: {
  id: string;
  name: string;
  style: string;
}) => (
  <>
    <Link
      to="/community/recipes"
      className="inline-block mb-6 text-primary underline hover:opacity-80 transition"
    >
      ← Back to recipes
    </Link>

    <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
          {name}
        </h1>
        <p className="text-lg sm:text-2xl italic text-muted-foreground">
          {style}
        </p>
      </div>

      <Link to={`/dashboard/brew/${id}`} className="w-full sm:w-auto">
        <Button size="lg" className="w-full sm:w-auto">
          Brew this beer
        </Button>
      </Link>
    </div>
  </>
);
