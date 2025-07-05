import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DashboardAddBrewery() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isJoinable, setIsJoinable] = useState("false");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken({ template: "supabase" });

    const newBrewery = {
      name,
      city,
      country,
      description,
      image_url: imageUrl,
      is_joinable: isJoinable === "true",
    };

    try {
      const res = await fetch("http://localhost:3000/breweries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBrewery),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }

      const created = await res.json();
      navigate(`/community/breweries/${created.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert("Error creating brewery: " + err.message);
      } else {
        alert("Unexpected error occurred.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-2xl mx-auto py-12 px-4 lg:px-0">
        <Card>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Section label="Brewery Info">
                <LabeledInput
                  label="Name"
                  value={name}
                  onChange={setName}
                  required
                />
                <LabeledInput
                  label="City"
                  value={city}
                  onChange={setCity}
                  required
                />
                <LabeledInput
                  label="Country"
                  value={country}
                  onChange={setCountry}
                  required
                />
                <LabeledInput
                  label="Image URL"
                  value={imageUrl}
                  onChange={setImageUrl}
                />
                <LabeledTextarea
                  label="Description"
                  value={description}
                  onChange={setDescription}
                />
              </Section>

              <Section label="Settings">
                <div>
                  <Label>Visible to others?</Label>
                  <Select
                    value={isJoinable}
                    onValueChange={(val) => setIsJoinable(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Section>

              <Button type="submit" className="w-full">
                Create Brewery
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// --- Helper Components ---

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
