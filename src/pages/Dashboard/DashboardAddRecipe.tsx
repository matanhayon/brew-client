import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { Ingredient, BrewingStep } from "@/api/types";
import { INGREDIENT_TYPES } from "@/api/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DashboardAddRecipe() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [style, setStyle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", type: "grain" },
  ]);
  const [steps, setSteps] = useState<BrewingStep[]>([
    { stepNumber: 1, action: "" },
  ]);
  const [notes, setNotes] = useState("");

  const [targetABV, setTargetABV] = useState("");
  const [targetIBU, setTargetIBU] = useState("");
  const [targetSRM, setTargetSRM] = useState("");
  const [originalGravity, setOriginalGravity] = useState("");
  const [finalGravity, setFinalGravity] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [boilTimeMin, setBoilTimeMin] = useState("");
  const [mashTempC, setMashTempC] = useState("");
  const [mashTimeMin, setMashTimeMin] = useState("");

  const handleAddIngredient = () =>
    setIngredients([...ingredients, { name: "", amount: "", type: "grain" }]);

  const handleRemoveIngredient = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = [...ingredients];

    if (field === "type") {
      // Ensure `value` is one of the allowed Ingredient types
      if (
        INGREDIENT_TYPES.includes(value as (typeof INGREDIENT_TYPES)[number])
      ) {
        updated[index].type = value as Ingredient["type"];
      }
    } else {
      updated[index][field] = value;
    }

    setIngredients(updated);
  };

  const handleAddStep = () =>
    setSteps([
      ...steps,
      { stepNumber: steps.length + 1, action: "", durationMin: undefined },
    ]);

  const handleRemoveStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index));

  const handleStepChange = (
    index: number,
    field: keyof BrewingStep,
    value: string
  ) => {
    const updated = [...steps];
    const step = updated[index];

    switch (field) {
      case "stepNumber":
        step.stepNumber = parseInt(value, 10);
        break;
      case "temperatureC":
        step.temperatureC = value === "" ? undefined : parseFloat(value);
        break;
      case "durationMin":
        step.durationMin = value === "" ? undefined : parseFloat(value);
        break;
      case "notes":
      case "action":
        step[field] = value;
        break;
    }

    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await getToken({ template: "supabase" });

    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      if (user?.id) {
        formData.append("user_id", user.id);
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/upload/recipe-photo`, // or your actual upload endpoint
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Image upload failed");
        }

        const uploadRes = await res.json();
        imageUrl = uploadRes.publicUrl;
      } catch (err) {
        alert("Failed to upload image: " + err);
        return;
      }
    }

    const newRecipe = {
      name,
      style,
      imageUrl,
      description,
      ingredients,
      steps,
      notes,
      targetABV: targetABV ? parseFloat(targetABV) : null,
      targetIBU: targetIBU ? parseFloat(targetIBU) : null,
      targetSRM: targetSRM ? parseFloat(targetSRM) : null,
      originalGravity: originalGravity ? parseFloat(originalGravity) : null,
      finalGravity: finalGravity ? parseFloat(finalGravity) : null,
      batchSize: batchSize ? parseFloat(batchSize) : null,
      boilTimeMin: boilTimeMin ? parseInt(boilTimeMin) : null,
      mashTempC: mashTempC ? parseFloat(mashTempC) : null,
      mashTimeMin: mashTimeMin ? parseInt(mashTimeMin) : null,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecipe),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }

      const createdRecipe = await res.json();

      if (!createdRecipe.id) {
        throw new Error("Recipe created but missing ID");
      }

      navigate(`/community/recipes/${createdRecipe.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert("Error adding recipe: " + err.message);
      } else {
        console.error("Unexpected error", err);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 lg:px-0">
      <Card>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Section label="Basic Info">
              <LabeledInput
                label="Name"
                value={name}
                onChange={setName}
                required
              />
              <LabeledInput
                label="Style"
                value={style}
                onChange={setStyle}
                required
              />
              <div>
                <Label>Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <LabeledTextarea
                label="Description"
                value={description}
                onChange={setDescription}
              />
            </Section>

            <Section label="Ingredients">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end"
                >
                  <Input
                    value={ing.name}
                    onChange={(e) =>
                      handleIngredientChange(idx, "name", e.target.value)
                    }
                    placeholder="Name"
                    required
                  />
                  <Input
                    value={ing.amount}
                    onChange={(e) =>
                      handleIngredientChange(idx, "amount", e.target.value)
                    }
                    placeholder="Amount"
                    required
                  />
                  <Select
                    value={ing.type}
                    onValueChange={(val) =>
                      handleIngredientChange(idx, "type", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INGREDIENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveIngredient(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddIngredient}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Ingredient
              </Button>
            </Section>

            <Section label="Steps">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                >
                  <div className="md:col-span-2">
                    <LabeledInput
                      label="Action"
                      value={step.action}
                      onChange={(val) => handleStepChange(idx, "action", val)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <LabeledInput
                      label="Temp (°C)"
                      value={step.temperatureC?.toString() || ""}
                      onChange={(val) =>
                        handleStepChange(idx, "temperatureC", val)
                      }
                      type="number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <LabeledInput
                      label="Duration (min)"
                      value={step.durationMin?.toString() || ""}
                      onChange={(val) =>
                        handleStepChange(idx, "durationMin", val)
                      }
                      type="number"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <LabeledInput
                      label="Notes"
                      value={step.notes || ""}
                      onChange={(val) => handleStepChange(idx, "notes", val)}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveStep(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddStep}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </Button>
            </Section>

            <Section label="Recipe Stats">
              <LabeledInput
                label="Target ABV (%)"
                value={targetABV}
                onChange={setTargetABV}
                type="number"
              />
              <LabeledInput
                label="Target IBU"
                value={targetIBU}
                onChange={setTargetIBU}
                type="number"
              />
              <LabeledInput
                label="Target SRM"
                value={targetSRM}
                onChange={setTargetSRM}
              />
              <LabeledInput
                label="Original Gravity"
                value={originalGravity}
                onChange={setOriginalGravity}
              />
              <LabeledInput
                label="Final Gravity"
                value={finalGravity}
                onChange={setFinalGravity}
              />
            </Section>

            <Section label="Process Parameters">
              <LabeledInput
                label="Batch Size"
                value={batchSize}
                onChange={setBatchSize}
              />
              <LabeledInput
                label="Boil Time (min)"
                value={boilTimeMin}
                onChange={setBoilTimeMin}
                type="number"
              />
              <LabeledInput
                label="Mash Temp (°C)"
                value={mashTempC}
                onChange={setMashTempC}
                type="number"
              />
              <LabeledInput
                label="Mash Time (min)"
                value={mashTimeMin}
                onChange={setMashTimeMin}
                type="number"
              />
            </Section>

            <LabeledTextarea label="Notes" value={notes} onChange={setNotes} />

            <Button type="submit" className="w-full">
              Submit Recipe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{label}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
      />
    </div>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
