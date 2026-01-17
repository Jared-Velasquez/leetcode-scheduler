import { createClient } from "@/lib/supabase/client";

export type AuthProvider = "github" | "google";
export const PROVIDERS: Record<string, AuthProvider> = {
  github: "github",
  google: "google",
};

const supabase = createClient();

export async function signInWithProvider(provider: AuthProvider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
