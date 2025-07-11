// src/api/useCreateSupabaseRequest.ts
import { useSession } from "@clerk/clerk-react";

export const useCreateSupabaseRequest = () => {
  const { session } = useSession();

  const callBackend = async () => {
    const token = await session?.getToken({ template: "supabase" });

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/some-supabase-call`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          /* any data */
        }),
      }
    );

    return res.json();
  };

  return { callBackend };
};
