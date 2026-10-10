export function isAdminEmail(email: string | null | undefined) {
  const allowed = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!allowed || !email) return false;
  return email.trim().toLowerCase() === allowed;
}
