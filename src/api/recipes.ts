export async function fetchRecipes(breweryId: string) {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/recipes/by-brewery-members?brewery_id=${breweryId}`
  );
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}
