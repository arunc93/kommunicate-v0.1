import { formatDate } from "@/lib/utils";

export interface HourRow {
  id: string;
  date: string;
  category: string;
  subCategory: string;
  hours: number;
  remarks?: string | null;
  effortSpentBy: string;
  request?: { projectNumber: number; projectName: string } | null;
}

export function HoursTable({
  rows,
  showPerson,
  showProject,
}: {
  rows: HourRow[];
  showPerson?: boolean;
  showProject?: boolean;
}) {
  const total = rows.reduce((sum, row) => sum + row.hours, 0);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-elevation-1">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left font-semibold text-text">Date</th>
              {showProject && <th className="px-4 py-3 text-left font-semibold text-text">Project</th>}
              {showPerson && <th className="px-4 py-3 text-left font-semibold text-text">Person</th>}
              <th className="px-4 py-3 text-left font-semibold text-text">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-text">Sub-category</th>
              <th className="px-4 py-3 text-left font-semibold text-text">Hours</th>
              <th className="px-4 py-3 text-left font-semibold text-text">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-text-muted" colSpan={7}>
                  No hours yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-text">{formatDate(row.date)}</td>
                  {showProject && (
                    <td className="px-4 py-3 text-text">
                      {row.request
                        ? `${row.request.projectNumber} ${row.request.projectName}`
                        : ""}
                    </td>
                  )}
                  {showPerson && <td className="px-4 py-3 text-text">{row.effortSpentBy}</td>}
                  <td className="px-4 py-3 text-text">{row.category}</td>
                  <td className="px-4 py-3 text-text">{row.subCategory}</td>
                  <td className="px-4 py-3 text-text">{row.hours}</td>
                  <td className="px-4 py-3 text-text-muted">{row.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border px-4 py-3 text-sm font-medium text-text">
        Total hours: {total.toFixed(2)}
      </div>
    </div>
  );
}
