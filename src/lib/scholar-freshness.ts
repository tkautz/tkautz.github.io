export function freshCitationCount(data: { citations?: unknown; fetchedAt?: unknown }, now = Date.now()): number | null {
  const { citations, fetchedAt } = data;
  if (typeof citations !== "number" || !Number.isSafeInteger(citations) || citations <= 0 ||
      typeof fetchedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fetchedAt)) return null;
  const verified = Date.parse(`${fetchedAt}T00:00:00Z`);
  if (!Number.isFinite(verified) || new Date(verified).toISOString().slice(0, 10) !== fetchedAt) return null;
  const age = now - verified;
  return age >= 0 && age <= 30 * 24 * 60 * 60 * 1000 ? citations : null;
}
