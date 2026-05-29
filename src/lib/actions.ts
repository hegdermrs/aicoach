"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Tier } from "@/lib/types";
import { getProfile } from "@/lib/data";

export async function completePrep(
  weekNumber: number,
  responses: Record<string, unknown>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("prep_completions").upsert(
    {
      user_id: user.id,
      week_number: weekNumber,
      responses,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,week_number" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/prep/${weekNumber}`);

  return { success: true };
}

export async function signUpWithInvite(input: {
  inviteCode: string;
  name: string;
  email: string;
  password: string;
}) {
  const code = input.inviteCode.trim().toUpperCase();
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const password = input.password;

  if (!code || !email || !name || password.length < 8) {
    return { error: "Fill in all fields. Password must be at least 8 characters." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Server is not configured for sign up. Contact your coach." };
  }

  const { data: invite } = await admin
    .from("invite_codes")
    .select("id, tier, cohort_start, reusable")
    .eq("code", code)
    .or("reusable.eq.true,used_at.is.null")
    .maybeSingle();

  if (!invite) {
    return { error: "Invalid or already used invite code." };
  }

  const supabase = await createClient();
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        tier: invite.tier,
        cohort_start: invite.cohort_start,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (!authData.user) {
    return { error: "Sign up failed. Please try again." };
  }

  if (!invite.reusable) {
    const { data: redeemed } = await admin
      .from("invite_codes")
      .update({
        used_at: new Date().toISOString(),
        used_by: authData.user.id,
      })
      .eq("id", invite.id)
      .is("used_at", null)
      .select("id")
      .maybeSingle();

    if (!redeemed) {
      await admin.auth.admin.deleteUser(authData.user.id);
      return { error: "That invite code was just used. Ask your coach for a new one." };
    }
  }

  revalidatePath("/admin");
  redirect("/dashboard");
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createInviteCode(input: {
  tier: Tier;
  cohortStart: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const profile = await getProfile();

  if (!profile?.is_admin) {
    return { error: "Unauthorized" };
  }

  const code = generateCode();

  const { error } = await supabase.from("invite_codes").insert({
    code,
    tier: input.tier,
    cohort_start: input.cohortStart,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true, code };
}
