import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function DashboardAddRecipe() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [style, setStyle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [grains, setGrains] = useState([{ name: "", amount: "" }]);
  const [hops, setHops] = useState([{ name: "", amount: "", time: "" }]);
  const [yeasts, setYeasts] = useState([
    { name: "", amount: "", temperature: "" },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken({ template: "supabase" });
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        if (user?.id) formData.append("user_id", user.id);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/upload/recipe-photo`,
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
      }

      const newRecipe = {
        name,
        style,
        imageUrl,
        description,
        grains,
        hops,
        yeasts,
        notes,
        targetABV: targetABV ? parseFloat(targetABV) : null,
        targetIBU: targetIBU ? parseFloat(targetIBU) : null,
        targetSRM: targetSRM ? parseFloat(targetSRM) : null,
        originalGravity: originalGravity ? parseFloat(originalGravity) : null,
        finalGravity: finalGravity ? parseFloat(finalGravity) : null,
        batchSize: batchSize ? parseFloat(batchSize) : null,
        mashTimeMin: mashTimeMin ? parseInt(mashTimeMin) : null,
        mashTempC: mashTempC ? parseFloat(mashTempC) : null,
        boilTimeMin: boilTimeMin ? parseInt(boilTimeMin) : null,
      };

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
    } catch (err) {
      console.error(err);
      alert(
        "Error: " + (err instanceof Error ? err.message : "Unexpected error")
      );
    } finally {
      setIsLoading(false);
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
              <Tabs defaultValue="grains" className="w-full space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="grains">Grains</TabsTrigger>
                  <TabsTrigger value="hops">Hops</TabsTrigger>
                  <TabsTrigger value="yeast">Yeast</TabsTrigger>
                </TabsList>

                <TabsContent value="grains">
                  {grains.map((grain, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[2fr_1fr_auto] gap-2 items-end mb-2"
                    >
                      <Input
                        value={grain.name}
                        onChange={(e) => {
                          const updated = [...grains];
                          updated[idx].name = e.target.value;
                          setGrains(updated);
                        }}
                        placeholder="Name"
                        required
                      />
                      <Input
                        value={grain.amount}
                        onChange={(e) => {
                          const updated = [...grains];
                          updated[idx].amount = e.target.value;
                          setGrains(updated);
                        }}
                        placeholder="kg"
                        type="number"
                        required
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setGrains(grains.filter((_, i) => i !== idx))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setGrains([...grains, { name: "", amount: "" }])
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Grain
                  </Button>
                </TabsContent>

                <TabsContent value="hops">
                  {hops.map((hop, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end mb-2"
                    >
                      <Input
                        value={hop.name}
                        onChange={(e) => {
                          const updated = [...hops];
                          updated[idx].name = e.target.value;
                          setHops(updated);
                        }}
                        placeholder="Name"
                        required
                      />
                      <Input
                        value={hop.amount}
                        onChange={(e) => {
                          const updated = [...hops];
                          updated[idx].amount = e.target.value;
                          setHops(updated);
                        }}
                        placeholder="grams"
                        type="number"
                        required
                      />
                      <Input
                        value={hop.time}
                        onChange={(e) => {
                          const updated = [...hops];
                          updated[idx].time = e.target.value;
                          setHops(updated);
                        }}
                        placeholder="Minutes"
                        type="number"
                        required
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setHops(hops.filter((_, i) => i !== idx))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setHops([...hops, { name: "", amount: "", time: "" }])
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Hop
                  </Button>
                </TabsContent>

                <TabsContent value="yeast">
                  {yeasts.map((yeast, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end mb-2"
                    >
                      <Input
                        value={yeast.name}
                        onChange={(e) => {
                          const updated = [...yeasts];
                          updated[idx].name = e.target.value;
                          setYeasts(updated);
                        }}
                        placeholder="Name"
                        required
                      />
                      <Input
                        value={yeast.amount}
                        onChange={(e) => {
                          const updated = [...yeasts];
                          updated[idx].amount = e.target.value;
                          setYeasts(updated);
                        }}
                        placeholder="grams"
                        type="number"
                        required
                      />
                      <Input
                        value={yeast.temperature}
                        onChange={(e) => {
                          const updated = [...yeasts];
                          updated[idx].temperature = e.target.value;
                          setYeasts(updated);
                        }}
                        placeholder="(°C)"
                        type="number"
                        required
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setYeasts(yeasts.filter((_, i) => i !== idx))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setYeasts([
                        ...yeasts,
                        { name: "", amount: "", temperature: "" },
                      ])
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Yeast
                  </Button>
                </TabsContent>
              </Tabs>
            </Section>

            <Section label="Recipe Stats">
              <Tabs defaultValue="abv-ibu" className="w-full space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="abv-ibu">ABV / IBU / SRM</TabsTrigger>
                  <TabsTrigger value="gravity">Gravity</TabsTrigger>
                </TabsList>

                <TabsContent value="abv-ibu">
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
                </TabsContent>

                <TabsContent value="gravity">
                  <LabeledInput
                    label="Expected Original Gravity"
                    value={originalGravity}
                    onChange={setOriginalGravity}
                  />
                  <LabeledInput
                    label="Expected Final Gravity"
                    value={finalGravity}
                    onChange={setFinalGravity}
                  />
                </TabsContent>
              </Tabs>
            </Section>

            <Section label="Process Parameters">
              <LabeledInput
                label="Batch Size (L)"
                value={batchSize}
                onChange={setBatchSize}
                type="number"
                required
              />
              <LabeledInput
                label="Mash Time (min)"
                value={mashTimeMin}
                onChange={setMashTimeMin}
                type="number"
                required
              />
              <LabeledInput
                label="Mash Temp (°C)"
                value={mashTempC}
                onChange={setMashTempC}
                type="number"
                required
              />
              <LabeledInput
                label="Boil Time (min)"
                value={boilTimeMin}
                onChange={setBoilTimeMin}
                type="number"
                required
              />
            </Section>

            <LabeledTextarea label="Notes" value={notes} onChange={setNotes} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Recipe"
              )}
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
