import { Clock, Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  mashTempC?: number;
  mashTimeMin?: number;
  boilTimeMin?: number;
  originalGravity?: string;
  finalGravity?: string;
};

export const RecipeSteps = ({
  mashTempC,
  mashTimeMin,
  boilTimeMin,
  originalGravity,
  finalGravity,
}: Props) => {
  console.log("RecipeSteps props:", {
    mashTempC,
    mashTimeMin,
    boilTimeMin,
    originalGravity,
    finalGravity,
  });

  const steps = [
    mashTempC !== undefined && mashTimeMin !== undefined
      ? {
          stepNumber: 1,
          title: "Mash",
          temperature: mashTempC,
          duration: mashTimeMin,
        }
      : null,
    boilTimeMin !== undefined
      ? {
          stepNumber: 2,
          title: "Boil",
          duration: boilTimeMin,
        }
      : null,
    originalGravity || finalGravity
      ? {
          stepNumber: 3,
          title: "Fermentation",
          notes: `OG: ${originalGravity ?? "?"}, FG: ${finalGravity ?? "?"}`,
        }
      : null,
  ].filter(Boolean) as {
    stepNumber: number;
    title: string;
    temperature?: number;
    duration?: number;
    notes?: string;
  }[];

  if (steps.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b pb-2">
          Brewing Steps
        </h2>
        <p className="text-muted-foreground italic">
          No brewing steps provided.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b pb-2">
        Brewing Steps
      </h2>
      <div className="space-y-4">
        {steps.map(({ stepNumber, title, temperature, duration, notes }) => (
          <Card key={stepNumber} className="border shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-primary font-semibold">
                  Step {stepNumber}: {title}
                </span>
                {duration !== undefined && (
                  <span className="text-muted-foreground text-sm inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {duration} min
                  </span>
                )}
              </div>
              {temperature !== undefined && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Thermometer className="w-4 h-4" />
                  {temperature}°C
                </div>
              )}
              {notes && (
                <p className="text-sm text-muted-foreground italic">{notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
