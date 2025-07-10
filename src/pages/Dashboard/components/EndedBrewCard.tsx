import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Brew } from "@/api/types";

const EndedBrewCard = ({ brew }: { brew: Brew }) => (
  <Card>
    <CardHeader>
      <CardTitle>Brew Log</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <p>
        <strong>Original Gravity:</strong> {brew.original_gravity ?? "-"}
      </p>
      <p>
        <strong>Final Gravity:</strong> {brew.final_gravity ?? "-"}
      </p>
      <p>
        <strong>ABV:</strong>{" "}
        {brew.abv ?? brew.recipe_snapshot.targetABV ?? "-"}
      </p>
      <p>
        <strong>Notes:</strong> {brew.notes ?? "-"}
      </p>
    </CardContent>
  </Card>
);

export default EndedBrewCard;
