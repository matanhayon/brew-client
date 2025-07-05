import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Brewery = {
  id: string;
  name: string;
  city?: string;
  country?: string;
  description?: string;
  image_url?: string;
  is_joinable?: boolean;
};

const BreweryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [brewery, setBrewery] = useState<Brewery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/breweries/${id}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Brewery not found");
          else throw new Error("Failed to fetch brewery");
        }
        return res.json();
      })
      .then((data: Brewery) => setBrewery(data))
      .catch((err) => {
        console.error("Error fetching brewery:", err);
        setError(err.message);
        setBrewery(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="container mx-auto p-10 text-center text-muted-foreground italic">
        Loading brewery...
      </p>
    );
  }

  if (error || !brewery) {
    return (
      <p className="container mx-auto p-10 text-center text-destructive font-medium">
        {error || "Brewery not found."}
      </p>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 rounded-xl shadow-md border">
      <h1 className="text-4xl font-bold mb-4">{brewery.name}</h1>

      {/* Location info */}
      {(brewery.city || brewery.country) && (
        <p className="text-muted-foreground mb-2">
          {brewery.city && `${brewery.city}, `}
          {brewery.country}
        </p>
      )}

      {/* Image */}
      {brewery.image_url && (
        <img
          src={brewery.image_url}
          alt={brewery.name}
          className="w-full max-w-3xl rounded-lg shadow mb-8 object-cover mx-auto"
          loading="lazy"
        />
      )}

      {/* Description */}
      {brewery.description && (
        <p className="text-base sm:text-lg leading-relaxed mb-6">
          {brewery.description}
        </p>
      )}

      {/* Public/Joinable status */}
      <div className="mb-4">
        <span className="font-semibold">Visibility:</span>{" "}
        {brewery.is_joinable ? (
          <span className="text-green-600 font-medium">Public</span>
        ) : (
          <span className="text-gray-500 font-medium">
            Private (Invite Only)
          </span>
        )}
      </div>
    </div>
  );
};

export default BreweryDetail;
