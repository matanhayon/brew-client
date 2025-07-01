import type { BeerRecipe } from "@/api/types";

export const RecipeMeta = ({ recipe }: { recipe: BeerRecipe }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-muted-foreground mb-10">
    <div>
      <span className="font-medium">ABV:</span> {recipe.targetABV ?? "-"}%
    </div>
    <div>
      <span className="font-medium">IBU:</span> {recipe.targetIBU ?? "-"}
    </div>
    <div>
      <span className="font-medium">SRM:</span> {recipe.targetSRM ?? "-"}
    </div>
    <div>
      <span className="font-medium">OG:</span> {recipe.originalGravity ?? "-"}
    </div>
    <div>
      <span className="font-medium">FG:</span> {recipe.finalGravity ?? "-"}
    </div>
    <div>
      <span className="font-medium">Batch Size:</span> {recipe.batchSize ?? "-"}
    </div>
    <div>
      <span className="font-medium">Mash Temp:</span>{" "}
      {recipe.mashTempC ? `${recipe.mashTempC}°C` : "-"}
    </div>
    <div>
      <span className="font-medium">Mash Time:</span>{" "}
      {recipe.mashTimeMin ? `${recipe.mashTimeMin} min` : "-"}
    </div>
    <div>
      <span className="font-medium">Boil Time:</span>{" "}
      {recipe.boilTimeMin ? `${recipe.boilTimeMin} min` : "-"}
    </div>
  </div>
);
