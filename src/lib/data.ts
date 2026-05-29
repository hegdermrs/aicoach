import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isCoachAdmin, isConfiguredAdminEmail } from "@/lib/admin";
import type { PrepCompletion, Profile, InviteCode } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data && !data.is_admin && user.email && isConfiguredAdminEmail(user.email)) {
    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", user.id);
      data = { ...data, is_admin: true };
    } catch {
      // Service role not configured — fall through
    }
  }

  return data as Profile | null;
}

export async function getAuthContext(): Promise<{
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile();
  const isAdmin = isCoachAdmin(profile, user?.email ?? profile?.email);

  return { user, profile, isAdmin };
}

export async function getPrepCompletions(): Promise<PrepCompletion[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("prep_completions")
    .select("*")
    .eq("user_id", user.id)
    .order("week_number");

  return (data ?? []) as PrepCompletion[];
}

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("name");

  return (data ?? []) as Profile[];
}

export function isMemberProfile(profile: Profile): boolean {
  return !profile.is_admin && !isConfiguredAdminEmail(profile.email);
}

export async function getMemberProfiles(): Promise<Profile[]> {
  const profiles = await getAllProfiles();
  return profiles.filter(isMemberProfile);
}

export async function getMemberCompletions(): Promise<PrepCompletion[]> {
  const memberIds = new Set((await getMemberProfiles()).map((p) => p.id));
  const completions = await getAllCompletions();
  return completions.filter((c) => memberIds.has(c.user_id));
}

export async function getAllCompletions(): Promise<PrepCompletion[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prep_completions")
    .select("*")
    .order("week_number");

  return (data ?? []) as PrepCompletion[];
}

export async function getInviteCodes(): Promise<InviteCode[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invite_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as InviteCode[];
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile?.is_admin) {
    throw new Error("Unauthorized");
  }
  return profile;
}
