import type { BrewingStep } from "@/api/types";

import { Clock, Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const RecipeSteps = ({ steps }: { steps: BrewingStep[] }) => (
  <section className="mb-10">
    <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b pb-2">
      Brewing Steps
    </h2>
    <div className="space-y-4">
      {steps.map(({ stepNumber, action, temperatureC, durationMin, notes }) => (
        <Card key={stepNumber} className="border shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-primary font-semibold">
                Step {stepNumber}
              </span>
              <span className="text-muted-foreground text-sm">
                {durationMin && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {durationMin} min
                  </span>
                )}
              </span>
            </div>
            <p className="text-base font-medium">{action}</p>
            {temperatureC !== undefined && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Thermometer className="w-4 h-4" />
                {temperatureC}°C
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
