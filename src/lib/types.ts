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
  "Brief submitted": "bg-pink text-white",
  "Internal review": "bg-cobalt text-white",
  "Design in progress": "bg-cobalt text-white",
  "Content in progress": "bg-cobalt text-white",
  "Draft delivered": "bg-pacific text-white",
  "Edit submitted": "bg-purple text-white",
  "Incorporating edits": "bg-cobalt text-white",
  Completed: "bg-success text-white",
  Declined: "bg-error text-white",
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
