const LEAD_PATTERNS = [
  /vp\s+of\s+engineering/i,
  /director/i,
  /senior\s+director/i,
  /head\s+of/i,
  /cto/i,
  /manager/i,
  /regional\s+manager/i,
  /software\s+factory\s+manager/i,
  /project\s+manager/i,
  /team\s+leader/i,
];

const IC_PATTERNS = [
  /software\s+engineer/i,
  /contributor/i,
  /developer/i,
  /interim\s+researcher/i,
  /researcher/i,
];

const BOTH_PATTERNS = [
  /founder/i,
  /technical\s+advisor/i,
  /cto/i, // CTO often combines leadership + hands-on (e.g. technical co-founder)
];

export type RoleType = "lead" | "ic" | "both";

export function classifyRole(roleName: string): RoleType {
  const lower = roleName.toLowerCase();
  for (const pattern of BOTH_PATTERNS) {
    if (pattern.test(lower)) return "both";
  }
  for (const pattern of LEAD_PATTERNS) {
    if (pattern.test(lower)) return "lead";
  }
  for (const pattern of IC_PATTERNS) {
    if (pattern.test(lower)) return "ic";
  }
  return "both";
}

export function matchesFilter(
  roleType: RoleType,
  filter: "all" | "lead" | "ic"
): boolean {
  if (filter === "all") return true;
  if (roleType === "both") return true;
  return roleType === filter;
}
