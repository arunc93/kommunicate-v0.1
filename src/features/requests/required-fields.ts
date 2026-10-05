export const REQUIRED_REQUEST_FIELDS = [
  { key: "projectName", label: "Project name" },
  { key: "category", label: "Category" },
  { key: "createdOnBehalfOf", label: "Created on behalf of" },
  { key: "requestSummary", label: "Request summary" },
  { key: "teamName", label: "Team name" },
  { key: "targetAudienceGeo", label: "Target audience geo" },
  { key: "targetReleaseDate", label: "Target release date" },
] as const;

export function missingRequestLabels(values: Record<string, unknown>): string[] {
  return REQUIRED_REQUEST_FIELDS.filter(({ key }) => {
    const value = values[key];
    return typeof value !== "string" || value.trim() === "";
  }).map(({ label }) => label);
}
