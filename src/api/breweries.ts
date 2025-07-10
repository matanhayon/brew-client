// api/dashboard/fetchMembers.ts
export async function fetchMembers(breweryId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/breweries/${breweryId}`
  );
  if (!res.ok) throw new Error("Failed to fetch members");
  const data = await res.json();
  return data.brewery_members?.length ?? 0;
}

export async function fetchBrews(breweryId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/brews?brewery_id=${breweryId}`
  );
  if (!res.ok) throw new Error("Failed to fetch brews");
  return res.json();
}

export async function fetchSensorStatus(breweryId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/sensor-status?brewery_id=${breweryId}`
  );
  if (!res.ok) throw new Error("Failed to fetch sensor status");
  return res.json();
}
