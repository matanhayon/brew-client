import { useUser } from "@clerk/clerk-react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
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
import { Loader2 } from "lucide-react";

export default function DashboardAddBrewery() {
  const { user } = useUser();
  const { refreshBreweries } = useActiveBrewery();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isJoinable, setIsJoinable] = useState("false");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loading

    const token = await getToken({ template: "supabase" });
    let imageUrl = "";

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        if (user?.id) {
          formData.append("user_id", user.id);
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/upload/brewery-photo`,
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
          throw new Error(errorData.error || "Upload failed");
        }

        const uploadRes = await res.json();
        imageUrl = uploadRes.publicUrl;
      }

      const newBrewery = {
        name,
        city,
        country,
        description,
        image_url: imageUrl,
        is_joinable: isJoinable === "true",
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/breweries`, {
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
      refreshBreweries();
      navigate(`/community/breweries/${created.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert("Error creating brewery: " + err.message);
      } else {
        alert("Unexpected error occurred.");
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
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
              {/* <LabeledInput
                  label="Image URL"
                  value={imageUrl}
                  onChange={setImageUrl}
                /> */}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Brewery"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
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
