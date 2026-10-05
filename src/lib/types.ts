export type RequestStatus =
  | "Brief submitted"
  | "Design in progress"
  | "Draft delivered"
  | "Completed";

export const STATUS_COLORS: Record<RequestStatus, string> = {
  "Brief submitted": "bg-[#e91e8c] text-white",
  "Design in progress": "bg-[#1a3a6b] text-white",
  "Draft delivered": "bg-[#4ebce9] text-white",
  Completed: "bg-[#0d9488] text-white",
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
