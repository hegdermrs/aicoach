function parseAdminEmails(): Set<string> {
  const emails = new Set<string>();

  const list = process.env.ADMIN_EMAILS?.split(",") ?? [];
  for (const email of list) {
    const trimmed = email.trim().toLowerCase();
    if (trimmed) emails.add(trimmed);
  }

  const single = process.env.ADMIN_EMAIL?.split(",") ?? [];
  for (const email of single) {
    const trimmed = email.trim().toLowerCase();
    if (trimmed) emails.add(trimmed);
  }

  return emails;
}

export function isConfiguredAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return parseAdminEmails().has(email.trim().toLowerCase());
}

export function isCoachAdmin(
  profile: { is_admin: boolean } | null,
  email: string | undefined | null,
): boolean {
  return Boolean(profile?.is_admin) || isConfiguredAdminEmail(email);
}
