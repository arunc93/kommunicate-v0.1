import { formatShortDate } from "@/lib/utils";

export interface DashboardExportRequest {
  projectNumber: number;
  projectName: string;
  description?: string;
  requestedOn: string;
  requestedBy: string;
  deadline?: string;
  status: string;
}

const defaultColumns = [
  "ID",
  "Project name",
  "Description",
  "Requested on",
  "Status",
  "Actions",
] as const;

const advancedColumns = [
  "ID",
  "Project name",
  "Requested on",
  "Requested by",
  "Deadline",
  "Status",
  "Actions",
] as const;

export function dashboardExportRows(
  requests: DashboardExportRequest[],
  advanced: boolean,
): (string | number)[][] {
  const columns = advanced ? advancedColumns : defaultColumns;
  const body = requests.map((request) => {
    const cells: Record<(typeof columns)[number], string | number> = {
      ID: request.projectNumber,
      "Project name": request.projectName,
      Description: request.description || request.projectName,
      "Requested on": formatShortDate(request.requestedOn),
      "Requested by": request.requestedBy,
      Deadline: request.deadline ? formatShortDate(request.deadline) : "",
      Status: request.status,
      Actions: "Open",
    };
    return columns.map((column) => cells[column]);
  });
  return [[...columns], ...body];
}

export async function downloadDashboardExport(
  requests: DashboardExportRequest[],
  advanced: boolean,
) {
  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.aoa_to_sheet(dashboardExportRows(requests, advanced));
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Dashboard");
  const bytes = XLSX.write(book, { bookType: "xlsx", type: "array" }) as BlobPart;
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dashboard.xlsx";
  link.click();
  URL.revokeObjectURL(url);
}
