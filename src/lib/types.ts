export const REQUEST_STATUSES = [
  "Brief submitted",
  "Internal review",
  "Design in progress",
  "Content in progress",
  "Draft delivered",
  "Edit submitted",
  "Incorporating edits",
  "Completed",
  "Declined",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const STATUS_COLORS: Record<RequestStatus, string> = {
  "Brief submitted": "bg-pink/10 text-pink",
  "Internal review": "bg-cobalt/10 text-cobalt",
  "Design in progress": "bg-cobalt/10 text-cobalt",
  "Content in progress": "bg-cobalt/10 text-cobalt",
  "Draft delivered": "bg-pacific/15 text-kpmg-blue",
  "Edit submitted": "bg-purple/10 text-purple",
  "Incorporating edits": "bg-cobalt/10 text-cobalt",
  Completed: "bg-success/10 text-success",
  Declined: "bg-error/10 text-error",
};

export const CATEGORIES = [
  "Newsletter",
  "Emailer",
  "Video",
  "Presentation",
  "Infographic",
  "Alert mailer",
  "Learning email",
  "Technology email",
];

export const TEAMS = ["HR", "Advisory", "Technology", "Consulting", "Marketing"];

export const GEO_OPTIONS = ["US", "Global", "India", "EMEA", "APAC"];

export const HOUR_CATEGORIES = [
  "Design",
  "Content",
  "Review",
  "Production",
  "Coordination",
];

export const HOUR_SUB_CATEGORIES: Record<string, string[]> = {
  Design: ["Layout", "Illustration", "Branding", "Animation"],
  Content: ["Copywriting", "Editing", "Proofreading"],
  Review: ["Internal review", "Client review", "QA"],
  Production: ["Email build", "Video edit", "Print prep"],
  Coordination: ["Planning", "Stakeholder mgmt", "Delivery"],
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const YEARS = ["2024", "2025", "2026"];
