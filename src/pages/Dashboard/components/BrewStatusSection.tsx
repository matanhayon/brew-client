import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Brew } from "@/api/types";

const BrewStatusSection = ({ brew }: { brew: Brew }) => {
  if (brew.status === "pending") {
    return (
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle>Pending Brew</AlertTitle>
        <AlertDescription>
          Trying to connect to brewing controller...
          <br />
          <strong>Secret Key:</strong> {brew.secret_key ?? "N/A"}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default BrewStatusSection;
