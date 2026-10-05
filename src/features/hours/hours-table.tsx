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
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              {showProject && <th>Project</th>}
              {showPerson && <th>Person</th>}
              <th>Category</th>
              <th>Sub-category</th>
              <th>Hours</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="text-text-muted" colSpan={7}>
                  No hours yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="text-text">{formatDate(row.date)}</td>
                  {showProject && (
                    <td className="text-text">
                      {row.request
                        ? `${row.request.projectNumber} ${row.request.projectName}`
                        : ""}
                    </td>
                  )}
                  {showPerson && <td className="text-text">{row.effortSpentBy}</td>}
                  <td className="text-text">{row.category}</td>
                  <td className="text-text">{row.subCategory}</td>
                  <td className="text-text">{row.hours}</td>
                  <td>{row.remarks}</td>
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
