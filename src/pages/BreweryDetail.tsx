import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type BreweryMember = {
  id: number;
  user_id: string;
  role: string;
  joined_at: string;
  user_name: string;
  user_email: string;
  user_image: string;
};

type Brewery = {
  id: string;
  name: string;
  city?: string;
  country?: string;
  description?: string;
  image_url?: string;
  is_joinable?: boolean;
  brewery_members?: BreweryMember[];
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

    fetch(`${import.meta.env.VITE_API_URL}/breweries/${id}`)
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
      <Link
        to="/community/breweries"
        className="inline-block mb-6 text-primary underline hover:opacity-80 transition"
      >
        ← Back to Breweries
      </Link>
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
          className="w-full max-w-3xl max-h-[500px] rounded-lg shadow mb-8 object-cover mx-auto"
          loading="lazy"
        />
      )}

      {/* Description */}
      {brewery.description && (
        <p className="text-base sm:text-lg leading-relaxed mb-6">
          {brewery.description}
        </p>
      )}

      {/* Members */}
      {brewery.brewery_members && brewery.brewery_members.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">Members</h2>
          <ul className="space-y-2">
            {brewery.brewery_members.map((member) => (
              <li
                key={member.id}
                className="border rounded p-3 shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  {member.user_image && (
                    <img
                      src={member.user_image}
                      alt={member.user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{member.user_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.user_email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Role:{" "}
                      {member.role.charAt(0).toUpperCase() +
                        member.role.slice(1)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
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
