import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Brew } from "@/api/types";

const badgeStyles = {
  pending: "bg-orange-100 text-orange-800",
  started: "bg-blue-100 text-blue-800",
  ended: "bg-green-100 text-green-800",
};

const BrewInfoCard = ({ brew }: { brew: Brew }) => (
  <Card>
    <CardHeader>
      <CardTitle>Brew Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <span>Status:</span>
        <Badge variant="outline" className={badgeStyles[brew.status]}>
          {brew.status.replace("_", " ")}
        </Badge>
      </div>
      <p>
        <strong>Started:</strong> {new Date(brew.created_at).toLocaleString()}
      </p>
      {brew.ended_at && (
        <p>
          <strong>Ended:</strong> {new Date(brew.ended_at).toLocaleString()}
        </p>
      )}
      {brew.notes && (
        <p>
          <strong>Notes:</strong> {brew.notes}
        </p>
      )}
    </CardContent>
  </Card>
);

export default BrewInfoCard;
